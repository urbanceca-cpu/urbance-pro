import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  identity,
  db,
  guardOrigin,
  OpsError,
  safeError,
  check,
} from "@/lib/ops/server";
import {paymentAdminContext,paymentReviewData,savePaymentAlerts} from "@/lib/ops/payment-review";
import { validateApplication, POLICY_VERSION } from "@/lib/ops/domain";
async function reviewer() {
  const user = await identity(),
    admin = db();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "super_admin"].includes(profile.role))
    throw new OpsError("Administrator access required.", 403);
  return { user, admin };
}
function fail(e: unknown) {
  const result = safeError(e);
  return NextResponse.json({ error: result.error }, { status: result.status });
}
export async function GET(req: NextRequest) {
  try {
    if(req.nextUrl.searchParams.get("view")==="payments") return NextResponse.json(await paymentReviewData(await paymentAdminContext()),{headers:{"Cache-Control":"private, no-store"}});
    const { admin } = await reviewer();
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const { data: application } = await admin
        .from("provider_applications")
        .select("*")
        .eq("id", z.string().uuid().parse(id))
        .single();
      if (!application) throw new OpsError("Application not found.", 404);
      const { data: docs } = await admin
        .from("ops_documents")
        .select("*")
        .eq("user_id", application.user_id);
      const signed = await Promise.all(
        (docs || []).map(async (d) => ({
          ...d,
          url: check(
            await admin.storage
              .from("ops-private")
              .createSignedUrl(d.path, 180),
          )?.signedUrl,
        })),
      );
      const { data: consents } = await admin
        .from("ops_consents")
        .select("version,acceptances,accepted_at")
        .eq("user_id", application.user_id);
      return NextResponse.json(
        { application, documents: signed, consents },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    const { data, error } = await admin
      .from("provider_applications")
      .select("id,user_id,status,basic_info,submitted_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new OpsError("Unable to load applications.", 503);
    return NextResponse.json(
      { applications: data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: NextRequest) {
  try {
    guardOrigin(req);
    const body=await req.json();
    if(body.action==="payment-alerts"){const v=z.object({action:z.literal("payment-alerts"),enabled:z.boolean()}).strict().parse(body);return NextResponse.json(await savePaymentAlerts(await paymentAdminContext(),v.enabled));}
    const { user, admin } = await reviewer();
    const v = z
      .object({
        id: z.string().uuid(),
        decision: z.enum(["approved", "rejected", "under_review"]),
        note: z.string().trim().min(10).max(2000),
      })
      .parse(body);
    const { data: app } = await admin
      .from("provider_applications")
      .select("*")
      .eq("id", v.id)
      .single();
    if (!app) throw new OpsError("Application not found.", 404);
    if (v.decision === "approved") {
      const { data: docs } = await admin
        .from("ops_documents")
        .select("*")
        .eq("user_id", app.user_id)
        .order("created_at", { ascending: false });
      const insurance = docs?.find((d) => d.kind === "liability_insurance");
      const values = {
        ...app.basic_info,
        insurance_expiry:
          insurance?.expires_at || app.basic_info.insurance_expiry,
      };
      try {
        validateApplication(
          values,
          (docs || [])
            .filter(
              (d) =>
                !d.expires_at ||
                Date.parse(d.expires_at + "T23:59:59Z") > Date.now(),
            )
            .map((d) => d.kind),
        );
      } catch (e) {
        throw new OpsError((e as Error).message);
      }
      const { data: consent } = await admin
        .from("ops_consents")
        .select("id")
        .eq("user_id", app.user_id)
        .eq("version", POLICY_VERSION)
        .maybeSingle();
      if (!consent)
        throw new OpsError(
          "Current agreement acceptance is missing. Ask the applicant to complete the updated application.",
        );
      check(
        await admin
          .from("ops_documents")
          .update({ verified_at: new Date().toISOString() })
          .eq("user_id", app.user_id),
      );
      check(
        await admin
          .from("provider_applications")
          .update({ basic_info: values })
          .eq("id", app.id),
      );
      // Provider classification follows review; never overwrite an admin role.
      check(await admin.from("profiles").update({ role: "provider" })
        .eq("id", app.user_id).eq("role", "customer"));
    }
    check(
      await admin
        .from("provider_applications")
        .update({ status: v.decision, updated_at: new Date().toISOString() })
        .eq("id", app.id),
    );
    const { data: business } = await admin
      .from("ops_businesses")
      .select("id")
      .eq("owner_user_id", app.user_id)
      .single();
    check(
      await admin
        .from("ops_audit")
        .insert({
          actor_id: user.id,
          business_id: business?.id,
          action: "application." + v.decision,
          entity: app.id,
          details: { note: v.note },
        }),
    );
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", app.user_id)
      .single();
    if (profile?.email)
      check(
        await admin
          .from("ops_outbox")
          .insert({
            event_key: `application:${app.id}:${v.decision}:${Date.now()}`,
            business_id: business?.id,
            recipient: profile.email,
            subject: "Urbance · Provider application update",
            body: `Your application status is now ${v.decision.replaceAll("_", " ")}.\n\nReviewer note: ${v.note}\n\nCheck your status at https://pros.urbance.ca/application-status . Contact support@urbance.ca for help.`,
          }),
      );
    return NextResponse.json({ success: true });
  } catch (e) {
    return fail(e);
  }
}
