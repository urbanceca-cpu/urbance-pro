import "server-only";
import { cache } from "react";
import { createClient as supabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { permissionsFor, type Permission } from "./domain";

export class OpsError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function db() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key)
    throw new OpsError(
      "Provider services are not configured. Contact support.",
      503,
    );
  return supabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export const identity = cache(async function identity() {
  const client = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) throw new OpsError("Sign in to continue.", 401);
  return user;
});
export async function context(permission?: Permission) {
  const user = await identity(),
    admin = db();
  const { data: membership, error } = await admin
    .from("ops_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new OpsError("Unable to load your workspace.", 503);
  if (!membership)
    throw new OpsError(
      "Complete your application or accept your team invitation.",
      403,
    );
  const [{ data: business }, { data: application }] = await Promise.all([
    admin
      .from("ops_businesses")
      .select("*")
      .eq("id", membership.business_id)
      .single(),
    admin
      .from("provider_applications")
      .select("status")
      .eq("user_id", membership.owner_user_id)
      .maybeSingle(),
  ]);
  if (!business || application?.status !== "approved" || business.suspended)
    throw new OpsError(
      "Your business must be approved and active to use this workspace.",
      403,
    );
  if (!business.is_demo && process.env.OPS_LIVE_ENABLED !== "true")
    throw new OpsError(
      "Live provider operations are temporarily paused while the secure rollout is completed. Contact support@urbance.ca.",
      503,
    );
  const permissions = permissionsFor(membership.role, membership.permissions);
  if (permission && !permissions.includes(permission))
    throw new OpsError("Your team role does not allow this action.", 403);
  return { user, admin, business, membership, permissions };
}
export type Context = Awaited<ReturnType<typeof context>>;
export async function jobAccess(ctx: Context, id: string, work = false) {
  const { data: job, error } = await ctx.admin
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const { data: state } = await ctx.admin
    .from("ops_job_state")
    .select("*")
    .eq("job_id", id)
    .maybeSingle();
  if (error || !job || job.partner_id !== ctx.business.owner_user_id)
    throw new OpsError("Job not found.", 404);
  if (
    !ctx.permissions.includes("jobs.view") &&
    state?.assigned_user_id !== ctx.user.id
  )
    throw new OpsError("This job is not assigned to you.", 403);
  if (work && !ctx.permissions.includes("jobs.work"))
    throw new OpsError("Your role cannot update jobs.", 403);
  if (
    work &&
    ctx.membership.role === "technician" &&
    state?.assigned_user_id !== ctx.user.id
  )
    throw new OpsError("This job is not assigned to you.", 403);
  return { job, state };
}
export function guardOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  if (origin) {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new OpsError("Invalid request origin.", 403);
    }
    if (
      parsed.host !== host ||
      !["http:", "https:"].includes(parsed.protocol) ||
      (process.env.NODE_ENV === "production" && parsed.protocol !== "https:")
    )
      throw new OpsError("Invalid request origin.", 403);
  }
}
export function check<T>(result: {
  data: T;
  error: { message: string } | null;
}): T {
  if (result.error)
    throw new OpsError("Unable to save this change. Please retry.", 503);
  return result.data;
}
export async function audit(
  ctx: Context,
  action: string,
  entity: string,
  details: Record<string, unknown> = {},
) {
  check(
    await ctx.admin
      .from("ops_audit")
      .insert({
        business_id: ctx.business.id,
        actor_id: ctx.user.id,
        action,
        entity,
        details,
      }),
  );
}
export function safeError(error: unknown) {
  return {
    error:
      error instanceof OpsError
        ? error.message
        : "Something went wrong. Please retry.",
    status: error instanceof OpsError ? error.status : 500,
  };
}
