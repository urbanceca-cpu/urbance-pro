import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import {
  identity,
  context,
  jobAccess,
  db,
  check,
  guardOrigin,
  OpsError,
  safeError,
  audit,
} from "@/lib/ops/server";
import {
  CATEGORIES,
  CITIES,
  POLICY_VERSION,
  permissionsFor,
  validateApplication,
  calculateInvoice,
  normalizeCategory,
  eligible,
} from "@/lib/ops/domain";
import {
  dispatch,
  deliverMail,
  queueJobNotifications,
} from "@/lib/ops/dispatch";
import { independentJobs, saveIndependentJob, invoiceIndependentJob } from "@/lib/ops/independent";
import { getWorkspace } from "@/lib/ops/workspace";
import { businessReady } from "@/lib/ops/readiness";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
type RouteContext = { params: Promise<{ path: string[] }> };
const text = (max = 500) => z.string().trim().max(max);
const uuid = z.string().uuid();
const appSchema = z.object({
  legal_name: text(150),
  business_name: text(150).optional(),
  business_type: z.enum(["individual", "team"]),
  phone: text(30),
  address: text(250),
  city: z.enum(Object.keys(CITIES) as [string, ...string[]]),
  postal_code: text(10),
  categories: z.array(z.enum(CATEGORIES)),
  worksafe_status: z.enum(["registered", "not_required_review"]),
  worksafe_number: text(60).optional(),
  insurance_limit: z.coerce.number(),
  insurance_expiry: text(20),
  licence_number: text(100).optional(),
  years_experience: z.coerce.number().min(0).max(80),
  authorized_to_work: z.boolean(),
  terms_accepted: z.boolean(),
  privacy_accepted: z.boolean(),
  contractor_accepted: z.boolean(),
  safety_accepted: z.boolean(),
  accuracy_accepted: z.boolean(),
  marketing_consent: z.boolean().default(false),
  notes: text(1500).default(""),
});
const statusHeaders = { "Cache-Control": "private, no-store" };
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: statusHeaders });
}
function failure(error: unknown) {
  if (error instanceof z.ZodError)
    return json({ error: error.issues[0]?.message || "Invalid request." }, 400);
  const e = safeError(error);
  if (e.status === 500)
    console.error(
      "[ops]",
      error instanceof Error ? error.message : "Unknown error",
    );
  return json({ error: e.error }, e.status);
}
function isWorker(req: NextRequest) {
  const expected = process.env.CRON_SECRET || "";
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  return (
    expected.length >= 32 &&
    Buffer.byteLength(token) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  );
}

export async function GET(req: NextRequest, route: RouteContext) {
  try {
    const path = (await route.params).path.join("/");
    if (path === "worker") {
      if (!isWorker(req)) throw new OpsError("Unauthorized", 401);
      const result = await dispatch();
      return json({ ...result, mail: await deliverMail() });
    }
    if (path === "application") {
      const user = await identity(),
        admin = db();
      const { data: app } = await admin
        .from("provider_applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const { data: docs } = await admin
        .from("ops_documents")
        .select("id,kind,original_name,expires_at,created_at")
        .eq("user_id", user.id);
      const { data: consent } = await admin
        .from("ops_consents")
        .select("id")
        .eq("user_id", user.id)
        .eq("version", POLICY_VERSION)
        .maybeSingle();
      return json({
        application:
          app?.status === "approved" && !consent
            ? { ...app, status: "draft" }
            : app,
        needs_upgrade: app?.status === "approved" && !consent,
        documents: docs || [],
        email: user.email,
        verified: !!user.email_confirmed_at,
      });
    }
    if (path === "access") {
      const user = await identity(),
        admin = db();
      const { data: member } = await admin
        .from("ops_members")
        .select("role,business_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (member) {
        try {
          const c = await context();
          return json({
            access: true,
            role: member.role,
            business_id: c.business.id,
          });
        } catch {
          /* Display application review state below. */
        }
      }
      const { data: app } = await admin
        .from("provider_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      return json({ access: false, status: app?.status || "draft" });
    }
    const authStarted = performance.now();
    const ctx = await context();
    const authDuration = performance.now() - authStarted;
    if (path === "business") return json({jobs:await independentJobs(ctx)});
    if (path === "workspace") {
      const started = performance.now();
      const data = await getWorkspace(ctx);
      const response = json(data);
      response.headers.set("Server-Timing", `auth;dur=${Math.round(authDuration)},workspace;dur=${Math.round(performance.now()-started)}`);
      return response;
    }
    if (path.startsWith("job/")) {
      const id = uuid.parse(path.split("/")[1]);
      const { job, state } = await jobAccess(ctx, id);
      const [{ data: events }, { data: photos }, { data: booking }] =
        await Promise.all([
          ctx.admin
            .from("ops_job_events")
            .select("*")
            .eq("job_id", id)
            .order("created_at"),
          ctx.admin
            .from("ops_job_photos")
            .select("*")
            .eq("job_id", id)
            .order("created_at"),
          job.booking_id
            ? ctx.admin
                .from("bookings")
                .select("quote_json,selections,notes,breakdown")
                .eq("id", job.booking_id)
                .single()
            : Promise.resolve({ data: null }),
        ]);
      const signed = await Promise.all(
        (photos || []).map(async (p) => ({
          ...p,
          url: check(
            await ctx.admin.storage
              .from("ops-private")
              .createSignedUrl(p.path, 300),
          )!.signedUrl,
        })),
      );
      const customerPhotos = await customerPhotoLinks(ctx.admin, job);
      return json({
        job,
        state:
          (ctx.permissions.includes("team.track") || state?.assigned_user_id === ctx.user.id) &&
          state?.sharing_location && Date.now()-Date.parse(state.location_at) < 300000
            ? state
            : {
                ...state,
                latitude: null,
                longitude: null,
                sharing_location: false,
                location_at: null,
              },
        events: events || [],
        photos: signed,
        booking,
        customerPhotos,
      });
    }
    if (path.startsWith("document/")) {
      if (!ctx.permissions.includes("documents.manage"))
        throw new OpsError("Permission required.", 403);
      const { data: doc } = await ctx.admin
        .from("ops_documents")
        .select("path")
        .eq("id", uuid.parse(path.split("/")[1]))
        .eq("user_id", ctx.business.owner_user_id)
        .single();
      if (!doc) throw new OpsError("Document not found.", 404);
      return json({
        url: check(
          await ctx.admin.storage
            .from("ops-private")
            .createSignedUrl(doc.path, 120),
        )!.signedUrl,
      });
    }
    throw new OpsError("Not found.", 404);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: NextRequest, route: RouteContext) {
  try {
    guardOrigin(req);
    const path = (await route.params).path.join("/");
    if (path === "upload") return await upload(req);
    if (Number(req.headers.get("content-length") || 0) > 100000)
      throw new OpsError("Request too large.", 413);
    const body = await req.json();
    if (path === "application") {
      const user = await identity();
      if (!user.email_confirmed_at)
        throw new OpsError("Verify your email before submitting.", 403);
      if (
        user.app_metadata?.ops_demo !== true &&
        process.env.OPS_LIVE_ENABLED !== "true"
      )
        throw new OpsError(
          "Provider intake is temporarily paused while the secure rollout is completed. Your existing application is saved.",
          503,
        );
      const admin = db(),
        values = appSchema.parse(body.data);
      const { data: app } = await admin
        .from("provider_applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const { data: consent } = await admin
        .from("ops_consents")
        .select("id")
        .eq("user_id", user.id)
        .eq("version", POLICY_VERSION)
        .maybeSingle();
      if (
        (app?.status === "approved" && consent) ||
        app?.status === "under_review" ||
        app?.status === "submitted"
      )
        throw new OpsError(
          "Your application is already submitted. Contact support to amend verification details.",
          409,
        );
      const submit = body.submit === true;
      if (submit) {
        const { data: docs } = await admin
          .from("ops_documents")
          .select("kind,expires_at")
          .eq("user_id", user.id);
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
      }
      const record = {
        user_id: user.id,
        basic_info: {
          ...values,
          full_legal_name: values.legal_name,
          email: user.email,
        },
        services_coverage: {
          primary_category: values.categories[0],
          categories: values.categories,
          service_areas: [values.city],
        },
        experience_standards: {
          is_insured: "yes",
          policy_limit: String(values.insurance_limit),
          license_details: values.licence_number,
        },
        step_completed: submit
          ? { profile: true, services: true, documents: true, agreements: true }
          : {},
        status: "draft",
        submitted_at: null,
      };
      // Provision the business first. A partial failure cannot grant job access (context checks application approval).
      if (submit) {
        const business = check(
          await admin
            .from("ops_businesses")
            .upsert(
              {
                owner_user_id: user.id,
                display_name: values.business_name || values.legal_name,
                mode: values.business_type,
                city: values.city,
                address: values.address,
                phone: values.phone,
                categories: values.categories,
                is_demo: user.app_metadata?.ops_demo === true,
              },
              { onConflict: "owner_user_id" },
            )
            .select()
            .single(),
        );
        check(
          await admin
            .from("ops_members")
            .upsert(
              {
                business_id: business.id,
                owner_user_id: user.id,
                user_id: user.id,
                name: values.legal_name,
                email: user.email,
                role: "owner",
              },
              { onConflict: "user_id" },
            ),
        );
      }
      const saved = check(
        await admin
          .from("provider_applications")
          .upsert(
            { ...record, ...(app ? { id: app.id } : {}) },
            { onConflict: "user_id" },
          )
          .select()
          .single(),
      );
      if (submit) {
        check(
          await admin
            .from("ops_consents")
            .upsert(
              {
                user_id: user.id,
                application_id: saved.id,
                version: POLICY_VERSION,
                acceptances: {
                  terms: values.terms_accepted,
                  privacy: values.privacy_accepted,
                  contractor: values.contractor_accepted,
                  safety: values.safety_accepted,
                  accuracy: values.accuracy_accepted,
                  authorized_to_work: values.authorized_to_work,
                  marketing: values.marketing_consent,
                },
              },
              { onConflict: "application_id,version" },
            ),
        );
        if (user.app_metadata?.ops_demo !== true)
          await admin
            .from("ops_outbox")
            .upsert(
              {
                event_key: `application:${saved.id}:submitted`,
                recipient: user.email,
                subject: "Urbance · Application received",
                body: "Your provider application is complete and awaiting review. Job access is enabled only after approval. Review your status at https://pros.urbance.ca/application-status . Contact support@urbance.ca for changes.",
              },
              { onConflict: "event_key", ignoreDuplicates: true },
            );
      }
      if (submit)
        check(
          await admin
            .from("provider_applications")
            .update({
              status: "submitted",
              submitted_at: new Date().toISOString(),
            })
            .eq("id", saved.id),
        );
      return json({
        success: true,
        status: submit ? "submitted" : saved.status,
      });
    }
    if (path === "invite/accept") {
      const user = await identity();
      if (!user.email_confirmed_at)
        throw new OpsError("Verify the invited email first.", 403);
      if (body.accepted !== true)
        throw new OpsError("Review and accept the team agreements.");
      const token = text(200).min(40).parse(body.token),
        admin = db();
      const result = check(
        await admin.rpc("ops_accept_invite", {
          p_token_hash: createHash("sha256").update(token).digest("hex"),
          p_user_id: user.id,
          p_email: user.email,
        }),
      );
      return json(result);
    }
    const ctx = await context();
    const take = check(
      await ctx.admin.rpc("ops_take_limit", {
        p_key: `ops:${ctx.user.id}:${path}`,
        p_limit: path === "heartbeat" ? 40 : 60,
        p_seconds: 60,
      }),
    );
    if (!take)
      throw new OpsError("Too many requests. Please wait a minute.", 429);
    if (path === "business") return json(await saveIndependentJob(ctx,body));
    if (path === "business/invoice") return json(await invoiceIndependentJob(ctx,body));
    if (path === "heartbeat") {
      if (
        !ctx.permissions.includes("settings.manage") &&
        !ctx.permissions.includes("jobs.accept")
      )
        throw new OpsError("Permission required.", 403);
      check(
        await ctx.admin
          .from("ops_businesses")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", ctx.business.id),
      );
      await dispatch();
      return json({ success: true });
    }
    if (path === "settings") {
      if (!ctx.permissions.includes("settings.manage"))
        throw new OpsError("Permission required.", 403);
      const values = z
        .object({
          mode: z.enum(["individual", "team"]),
          city: z.enum(Object.keys(CITIES) as [string, ...string[]]),
          max_travel_km: z.coerce.number().int().min(0).max(100),
          online: z.boolean(),
          repeat_offer_emails: z.boolean(),
          display_name: text(150).min(2),
          address: text(250).min(5),
          phone: text(30).min(10),
          gst_number: text(20).default(""),
        })
        .parse(body);
      if (values.mode === "individual") {
        const { count } = await ctx.admin
          .from("ops_members")
          .select("id", { count: "exact", head: true })
          .eq("business_id", ctx.business.id)
          .eq("active", true)
          .neq("role", "owner");
        if (count)
          throw new OpsError(
            "Deactivate team access before switching to individual mode.",
          );
      }
      check(
        await ctx.admin
          .from("ops_businesses")
          .update({ ...values, last_seen_at: new Date().toISOString() })
          .eq("id", ctx.business.id),
      );
      await audit(ctx, "settings.updated", ctx.business.id, {
        online: values.online,
        mode: values.mode,
      });
      if (values.online) await dispatch();
      return json({ success: true });
    }
    if (path === "accept") {
      if (!ctx.permissions.includes("jobs.accept"))
        throw new OpsError("Permission required.", 403);
      const id = uuid.parse(body.job_id);
      if (
        !(await businessReady(
          ctx.admin,
          ctx.business.owner_user_id,
          ctx.business.is_demo,
        ))
      )
        throw new OpsError(
          "Current reviewed documents and agreements are required to accept jobs.",
          403,
        );
      // Re-evaluate category, availability and travel range immediately before the atomic claim.
      const { data: job } = await ctx.admin
        .from("jobs")
        .select("service_type,service_name,service_city,created_at,is_demo")
        .eq("id", id)
        .single();
      const { data: offer } = await ctx.admin
        .from("ops_dispatch_offers")
        .select("wave")
        .eq("job_id", id)
        .eq("business_id", ctx.business.id)
        .single();
      if (
        !job ||
        !eligible(
          { ...ctx.business, approved: true },
          {
            city: job.service_city,
            category: normalizeCategory(job.service_type || job.service_name),
            created_at: job.created_at,
            is_demo: job.is_demo,
          },
          offer?.wave === "nearby",
        )
      )
        throw new OpsError(
          "This offer is no longer eligible. Refresh available jobs.",
          409,
        );
      const result = await ctx.admin.rpc("ops_accept_job", {
        p_job_id: id,
        p_business_id: ctx.business.id,
        p_actor_id: ctx.user.id,
      });
      if (result.error)
        throw new OpsError(
          "This job was already accepted, expired, or is no longer available.",
          409,
        );
      await queueJobNotifications(id, "accepted");
      return json(result.data);
    }
    if (path === "job/transition") {
      const values = z
        .object({
          job_id: uuid,
          to: z.enum(["en_route", "arrived", "in_progress", "completed"]),
          eta_minutes: z.coerce.number().int().min(1).max(360).optional(),
        })
        .parse(body);
      await jobAccess(ctx, values.job_id, true);
      const result = await ctx.admin.rpc("ops_transition_job", {
        p_job_id: values.job_id,
        p_actor_id: ctx.user.id,
        p_to: values.to,
        p_eta: values.eta_minutes || null,
      });
      if (result.error)
        throw new OpsError(
          "This transition requires the correct prior stage and job photos. Refresh and try again.",
          409,
        );
      await queueJobNotifications(values.job_id, values.to);
      return json(result.data);
    }
    if (path === "job/eta") {
      const v = z
        .object({
          job_id: uuid,
          eta_minutes: z.coerce.number().int().min(1).max(360),
        })
        .parse(body);
      const { state } = await jobAccess(ctx, v.job_id, true);
      if (state?.phase !== "en_route")
        throw new OpsError("ETA updates are available while travelling.", 409);
      check(
        await ctx.admin
          .from("ops_job_state")
          .update({
            eta_minutes: v.eta_minutes,
            eta_updated_at: new Date().toISOString(),
          })
          .eq("job_id", v.job_id)
          .eq("phase", "en_route"),
      );
      return json({ success: true });
    }
    if (path === "job/assign") {
      if (!ctx.permissions.includes("jobs.assign"))
        throw new OpsError("Permission required.", 403);
      const id = uuid.parse(body.job_id),
        userId = uuid.parse(body.user_id);
      await jobAccess(ctx, id);
      const { data: member } = await ctx.admin
        .from("ops_members")
        .select("*")
        .eq("business_id", ctx.business.id)
        .eq("user_id", userId)
        .eq("active", true)
        .single();
      if (
        !member ||
        !permissionsFor(member.role, member.permissions).includes("jobs.work")
      )
        throw new OpsError(
          "Choose an active team member with job-work access.",
        );
      check(
        await ctx.admin
          .from("ops_job_state")
          .update({ assigned_user_id: userId })
          .eq("job_id", id)
          .not("phase", "in", "(completed,cancelled)"),
      );
      await audit(ctx, "job.assigned", id, { assigned_user_id: userId });
      return json({ success: true });
    }
    if (path === "job/location") {
      const v = z
        .object({
          job_id: uuid,
          sharing: z.boolean(),
          latitude: z.number().min(-90).max(90).optional(),
          longitude: z.number().min(-180).max(180).optional(),
        })
        .parse(body);
      const { state } = await jobAccess(ctx, v.job_id, true);
      if (
        v.sharing &&
        (!state ||
          !["en_route", "arrived", "in_progress"].includes(state.phase) ||
          state.assigned_user_id !== ctx.user.id)
      )
        throw new OpsError(
          "Location sharing is only available to the assigned professional during an active job.",
          403,
        );
      check(
        await ctx.admin
          .from("ops_job_state")
          .update({
            sharing_location: v.sharing,
            latitude: v.sharing ? v.latitude : null,
            longitude: v.sharing ? v.longitude : null,
            location_at: v.sharing ? new Date().toISOString() : null,
          })
          .eq("job_id", v.job_id),
      );
      return json({ success: true });
    }
    if (path === "team/invite") {
      if (
        !ctx.permissions.includes("team.manage") ||
        ctx.business.mode !== "team"
      )
        throw new OpsError("Only a team owner can invite members.", 403);
      const v = z
        .object({
          email: z.string().email().max(254),
          name: text(100).min(2),
          role: z.enum([
            "manager",
            "dispatcher",
            "technician",
            "billing",
            "viewer",
          ]),
          permissions: z.array(z.string()).optional(),
        })
        .parse(body);
      const token = randomBytes(32).toString("hex");
      const invite = check(
        await ctx.admin
          .from("ops_invites")
          .insert({
            business_id: ctx.business.id,
            email: v.email.toLowerCase(),
            name: v.name,
            role: v.role,
            permissions: permissionsFor(v.role, v.permissions),
            token_hash: createHash("sha256").update(token).digest("hex"),
            created_by: ctx.user.id,
          })
          .select("id")
          .single(),
      );
      if (!invite) throw new OpsError("Unable to create invitation.", 503);
      const link = `https://pros.urbance.ca/invite?token=${token}`;
      if (!ctx.business.is_demo)
        check(
          await ctx.admin
            .from("ops_outbox")
            .insert({
              event_key: "invite:" + invite.id,
              business_id: ctx.business.id,
              recipient: v.email,
              subject: `You’re invited to ${ctx.business.display_name} on Urbance`,
              body: `${ctx.business.display_name} invited you as ${v.role}. This invitation expires in seven days and is tied to ${v.email}. Sign in with that verified email, review the team terms, and accept: ${link}`,
            }),
        );
      await audit(ctx, "team.invited", invite.id, { role: v.role });
      return json({
        success: true,
        invitationLink: link,
        emailQueued: !ctx.business.is_demo,
      });
    }
    if (path === "team/update") {
      if (!ctx.permissions.includes("team.manage"))
        throw new OpsError("Permission required.", 403);
      const v = z
        .object({
          id: uuid,
          role: z.enum([
            "manager",
            "dispatcher",
            "technician",
            "billing",
            "viewer",
          ]),
          permissions: z.array(z.string()).optional(),
          active: z.boolean(),
        })
        .parse(body);
      const { data: member } = await ctx.admin
        .from("ops_members")
        .select("*")
        .eq("id", v.id)
        .eq("business_id", ctx.business.id)
        .neq("role", "owner")
        .single();
      if (!member) throw new OpsError("Member not found.", 404);
      check(
        await ctx.admin
          .from("ops_members")
          .update({
            role: v.role,
            permissions: permissionsFor(v.role, v.permissions),
            active: v.active,
          })
          .eq("id", v.id),
      );
      await audit(ctx, "team.updated", v.id, {
        role: v.role,
        active: v.active,
      });
      return json({ success: true });
    }
    if (path === "invoice/create") {
      if (!ctx.permissions.includes("billing.manage"))
        throw new OpsError("Permission required.", 403);
      const v = z
        .object({
          customer_name: text(150).min(2),
          customer_email: z.string().email(),
          customer_address: text(250).min(5),
          due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          notes: text(1500).default(""),
          items: z.array(
            z.object({
              description: text(300).min(1),
              quantity: z.number(),
              unit_cents: z.number().int(),
            }),
          ),
          gst_rate: z.number(),
        })
        .parse(body);
      if (
        !Number.isFinite(Date.parse(v.due_date)) ||
        v.due_date < new Date().toISOString().slice(0, 10)
      )
        throw new OpsError("Choose a valid current or future due date.");
      let totals;
      try {
        totals = calculateInvoice(v.items, ctx.business.gst_number, v.gst_rate);
      } catch (e) {
        throw new OpsError((e as Error).message);
      }
      const invoice = check(
        await ctx.admin
          .from("ops_invoices")
          .insert({
            ...v,
            gst_rate: undefined,
            ...totals,
            business_id: ctx.business.id,
            issuer_name: ctx.business.display_name,
            issuer_address: ctx.business.address,
            gst_number: ctx.business.gst_number,
            created_by: ctx.user.id,
          })
          .select()
          .single(),
      );
      await audit(ctx, "invoice.created", invoice.id);
      return json({ invoice });
    }
    if (path === "invoice/update") {
      if (!ctx.permissions.includes("billing.manage"))
        throw new OpsError("Permission required.", 403);
      const id = uuid.parse(body.id),
        to = z.enum(["sent", "paid", "void"]).parse(body.status);
      const { data: invoice } = await ctx.admin
        .from("ops_invoices")
        .select("*")
        .eq("id", id)
        .eq("business_id", ctx.business.id)
        .single();
      if (!invoice) throw new OpsError("Invoice not found.", 404);
      if (
        invoice.status === "void" ||
        invoice.status === "paid" ||
        (to === "sent" && invoice.status !== "draft") ||
        (to === "paid" && invoice.status !== "sent")
      )
        throw new OpsError("Invalid invoice stage.", 409);
      if (to === "sent" && !ctx.business.is_demo) {
        check(
          await ctx.admin
            .from("ops_outbox")
            .upsert(
              {
                event_key: "invoice:" + id,
                business_id: ctx.business.id,
                recipient: invoice.customer_email,
                subject: `Invoice ${invoice.invoice_number} from ${invoice.issuer_name}`,
                body: invoiceText(invoice),
              },
              { onConflict: "event_key", ignoreDuplicates: true },
            ),
        );
      }
      check(
        await ctx.admin
          .from("ops_invoices")
          .update({
            status: to,
            ...(to === "sent" ? { sent_at: new Date().toISOString() } : {}),
            ...(to === "paid" ? { paid_at: new Date().toISOString() } : {}),
          })
          .eq("id", id)
          .eq("status", invoice.status),
      );
      await audit(ctx, "invoice." + to, id);
      return json({ success: true });
    }
    throw new OpsError("Not found.", 404);
  } catch (error) {
    return failure(error);
  }
}

async function upload(req: NextRequest) {
  const user = await identity(),
    admin = db();
  if (
    user.app_metadata?.ops_demo !== true &&
    process.env.OPS_LIVE_ENABLED !== "true"
  )
    throw new OpsError(
      "Document intake is temporarily paused while the secure rollout is completed.",
      503,
    );
  if (
    !check(
      await admin.rpc("ops_take_limit", {
        p_key: "upload:" + user.id,
        p_limit: 30,
        p_seconds: 3600,
      }),
    )
  )
    throw new OpsError("Upload limit reached. Try again later.", 429);
  const form = await req.formData(),
    file = form.get("file");
  if (!(file instanceof File) || file.size > 4194304 || !file.size)
    throw new OpsError("Choose a non-empty file up to 4 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  let mime = "";
  let ext = "";
  if (bytes.subarray(0, 5).toString() === "%PDF-") {
    mime = "application/pdf";
    ext = "pdf";
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    mime = "image/jpeg";
    ext = "jpg";
  } else if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    mime = "image/png";
    ext = "png";
  } else if (
    bytes.subarray(0, 4).toString() === "RIFF" &&
    bytes.subarray(8, 12).toString() === "WEBP"
  ) {
    mime = "image/webp";
    ext = "webp";
  }
  if (!mime || file.type !== mime)
    throw new OpsError(
      "Upload an original PDF, JPEG, PNG or WebP file with a matching file type.",
    );
  const jobId = form.get("job_id");
  let businessId: string | undefined, kind: string;
  if (jobId) {
    const ctx = await context("jobs.work");
    const { state } = await jobAccess(ctx, uuid.parse(jobId), true);
    businessId = ctx.business.id;
    kind = z.enum(["before", "during", "after"]).parse(form.get("phase"));
    if (mime === "application/pdf")
      throw new OpsError("Job evidence must be an image.");
    if (!state || ["completed", "cancelled"].includes(state.phase))
      throw new OpsError("Photos can only be added to an active job.");
    if (
      (kind === "before" &&
        !["arrived", "in_progress"].includes(state.phase)) ||
      (kind === "during" && state.phase !== "in_progress") ||
      (kind === "after" && state.phase !== "in_progress")
    )
      throw new OpsError(
        "Capture before photos on arrival, and during/after photos while work is in progress.",
      );
  } else {
    kind = z
      .enum([
        "government_id",
        "liability_insurance",
        "background_check",
        "worksafe_clearance",
        "trade_licence",
        "business_licence",
      ])
      .parse(form.get("kind"));
    const { data: app } = await admin
      .from("provider_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (app?.status === "submitted" || app?.status === "under_review")
      throw new OpsError(
        "Your documents are under review. Contact support to replace them.",
        409,
      );
  }
  const path = `${user.id}/${jobId ? "jobs/" + jobId : "verification"}/${randomBytes(16).toString("hex")}.${ext}`;
  check(
    await admin.storage
      .from("ops-private")
      .upload(path, bytes, { contentType: mime, upsert: false }),
  );
  try {
    if (jobId)
      check(
        await admin
          .from("ops_job_photos")
          .insert({
            job_id: jobId,
            business_id: businessId,
            actor_id: user.id,
            phase: kind,
            path,
            caption: String(form.get("caption") || "").slice(0, 500),
          }),
      );
    else
      check(
        await admin
          .from("ops_documents")
          .insert({
            user_id: user.id,
            kind,
            path,
            original_name: file.name.slice(0, 200),
            expires_at: form.get("expires_at") || null,
          }),
      );
  } catch (error) {
    await admin.storage.from("ops-private").remove([path]);
    throw error;
  }
  return json({ success: true, kind });
}

function invoiceText(i: Record<string, unknown>) {
  return `${i.issuer_name}\n${i.issuer_address}\nInvoice ${i.invoice_number}\nIssued: ${i.issued_date}\nDue: ${i.due_date}\nBill to: ${i.customer_name}\n${i.customer_address}\n\n${(i.items as { description: string; quantity: number; unit_cents: number }[]).map((x) => `${x.description}: ${x.quantity} × CAD ${(x.unit_cents / 100).toFixed(2)}`).join("\n")}\nSubtotal: CAD ${(Number(i.subtotal_cents) / 100).toFixed(2)}\nGST: CAD ${(Number(i.tax_cents) / 100).toFixed(2)}${i.gst_number ? "\nGST registration: " + i.gst_number : ""}\nTotal: CAD ${(Number(i.total_cents) / 100).toFixed(2)}\n\n${i.notes || ""}\n\nSupplier: ${i.issuer_name}. Generated through Urbance Technologies Inc. Payment collection is arranged directly with the supplier; this email does not charge your card. For questions reply to support@urbance.ca.`;
}

async function customerPhotoLinks(
  admin: ReturnType<typeof db>,
  job: Record<string, unknown>,
) {
  if (!job.booking_id || !job.user_id) return [];
  const { data: photos } = await admin
    .from("ops_customer_photos")
    .select("path")
    .eq("booking_id", job.booking_id)
    .eq("user_id", job.user_id);
  const links: string[] = [];
  for (const photo of photos || []) {
    const signed = await admin.storage
      .from("ops-private")
      .createSignedUrl(photo.path, 300);
    if (signed.data) links.push(signed.data.signedUrl);
  }
  return links;
}
