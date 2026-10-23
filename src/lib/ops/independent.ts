import { z } from "zod";
import { check, OpsError, type Context } from "./server";

export const independentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(150),
  customer_name: z.string().trim().min(2).max(150),
  customer_email: z.union([z.string().email(), z.literal("")]).default(""),
  address: z.string().trim().max(300).default(""),
  scheduled_at: z.string().datetime({ offset: true }).nullable().default(null),
  status: z.enum(["lead", "estimated", "scheduled", "in_progress", "completed", "cancelled"]),
  revenue_cents: z.number().int().min(0).max(100000000),
  materials_cents: z.number().int().min(0).max(100000000),
  labour_cents: z.number().int().min(0).max(100000000),
  travel_cents: z.number().int().min(0).max(100000000),
  overhead_cents: z.number().int().min(0).max(100000000),
  notes: z.string().trim().max(5000).default(""),
});
export type IndependentJob = z.infer<typeof independentSchema> & { id: string; updated_at: string };
export function independentAccess(ctx: Context) {
  if (!ctx.permissions.includes("billing.manage")) throw new OpsError("Your role cannot access private business finances.", 403);
}
export async function independentJobs(ctx: Context) {
  independentAccess(ctx);
  return check(await ctx.admin.from("ops_independent_jobs").select("*").eq("business_id",ctx.business.id).order("updated_at",{ascending:false}).limit(500)) || [];
}
export async function saveIndependentJob(ctx: Context, body: unknown) {
  independentAccess(ctx);
  const {id,...values}=independentSchema.parse(body);
  if(id) {
    const row=check(await ctx.admin.from("ops_independent_jobs").update({...values,updated_at:new Date().toISOString()}).eq("id",id).eq("business_id",ctx.business.id).select().maybeSingle());
    if(!row) throw new OpsError("Private job not found.",404);
    return row;
  }
  return check(await ctx.admin.from("ops_independent_jobs").insert({...values,business_id:ctx.business.id,created_by:ctx.user.id}).select().single());
}
