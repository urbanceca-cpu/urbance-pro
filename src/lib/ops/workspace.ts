import "server-only";
import { type Context, check } from "./server";
import { businessReady } from "./readiness";
import { normalizeCategory } from "./domain";
import type { WorkspaceData } from "./workspace-types";
// Request-local authorization remains mandatory; no shared user-data cache.
export async function getWorkspace(ctx: Context): Promise<WorkspaceData> {
  const can = (p: string) =>
    ctx.permissions.includes(p as (typeof ctx.permissions)[number]);
  const empty = Promise.resolve({ data: [], error: null });
  const [
    stateResult,
    offerResult,
    memberResult,
    invoiceResult,
    documentResult,
    messageResult,
    ready,
  ] = await Promise.all([
    ctx.admin
      .from("ops_job_state")
      .select("*")
      .eq("business_id", ctx.business.id),
    can("jobs.accept")
      ? ctx.admin
          .from("ops_dispatch_offers")
          .select("id,job_id,wave,status,expires_at")
          .eq("business_id", ctx.business.id)
          .eq("status", "open")
          .gt("expires_at", new Date().toISOString())
      : empty,
    can("team.manage") || can("team.track") || can("jobs.assign")
      ? ctx.admin
          .from("ops_members")
          .select("id,user_id,name,email,role,permissions,active")
          .eq("business_id", ctx.business.id)
      : empty,
    can("billing.manage")
      ? ctx.admin
          .from("ops_invoices")
          .select("*")
          .eq("business_id", ctx.business.id)
          .order("created_at", { ascending: false })
          .limit(100)
      : empty,
    can("documents.manage")
      ? ctx.admin
          .from("ops_documents")
          .select("id,kind,original_name,expires_at,verified_at")
          .eq("user_id", ctx.business.owner_user_id)
      : empty,
    ctx.membership.role === "owner"
      ? ctx.admin
          .from("ops_outbox")
          .select("id,subject,status,created_at")
          .eq("business_id", ctx.business.id)
          .order("created_at", { ascending: false })
          .limit(30)
      : empty,
    businessReady(ctx.admin, ctx.business.owner_user_id, ctx.business.is_demo),
  ]);
  const state = check(stateResult) || [],
    offers = check(offerResult) || [];
  const assigned = state
    .filter((s) => can("jobs.view") || s.assigned_user_id === ctx.user.id)
    .map((s) => s.job_id);
  const ids = offers.map((o) => o.job_id);
  const [jobsResult, offerJobsResult] = await Promise.all([
    assigned.length
      ? ctx.admin
          .from("jobs")
          .select("*")
          .in("id", assigned)
          .eq("partner_id", ctx.business.owner_user_id)
          .order("scheduled_date")
      : empty,
    ids.length && ready
      ? ctx.admin
          .from("jobs")
          .select(
            "id,service_type,service_name,service_city,scheduled_date,scheduled_time,price,payout_amount,booking_details",
          )
          .in("id", ids)
          .is("partner_id", null)
          .eq("job_status", "pending")
      : empty,
  ]);
  const offerMap = new Map(offers.map((o) => [o.job_id, o]));
  return {
    business: ctx.business,
    member: ctx.membership,
    permissions: ctx.permissions,
    jobs: check(jobsResult) || [],
    states: state
      .filter((s) => assigned.includes(s.job_id))
      .map((s) =>
        (can("team.track") || s.assigned_user_id === ctx.user.id) &&
        s.sharing_location &&
        s.location_at &&
        Date.now() - Date.parse(s.location_at) < 300000
          ? s
          : {
              ...s,
              latitude: null,
              longitude: null,
              sharing_location: false,
              location_at: null,
            },
      ),
    offers: (check(offerJobsResult) || []).map((j) => ({
      id: j.id,
      service: j.service_name || j.service_type,
      category: normalizeCategory(j.service_type || j.service_name || ""),
      city: j.service_city,
      date: j.scheduled_date,
      time: j.scheduled_time,
      gross: Number(j.price || j.payout_amount),
      net: Math.round(Number(j.price || j.payout_amount) * 0.93 * 100) / 100,
      wave: offerMap.get(j.id)?.wave || "local",
      expires_at: offerMap.get(j.id)?.expires_at || "",
      scope: (j.booking_details?.breakdown?.items || [])
        .slice(0, 12)
        .map((i: { label: string }) => i.label),
    })),
    members: check(memberResult) || [],
    invoices: check(invoiceResult) || [],
    documents: check(documentResult) || [],
    notifications: check(messageResult) || [],
    ready,
    emailConfigured:
      !!process.env.RESEND_API_KEY && !!process.env.NOTIFICATIONS_FROM,
  };
}
