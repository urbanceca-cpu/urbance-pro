import { z } from "zod";
import { check, OpsError, type Context } from "./server";
import { calculateInvoice } from "./domain";

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

export async function invoiceIndependentJob(ctx: Context, body: unknown) {
  independentAccess(ctx);
  const {id,gst_rate}=z.object({id:z.string().uuid(),gst_rate:z.union([z.literal(0),z.literal(0.05)])}).parse(body);
  const job=check(await ctx.admin.from("ops_independent_jobs").select("*").eq("id",id).eq("business_id",ctx.business.id).maybeSingle());
  if(!job) throw new OpsError("Private job not found.",404);
  const existing=check(await ctx.admin.from("ops_invoices").select("*").eq("source_independent_job_id",id).eq("business_id",ctx.business.id).maybeSingle());
  if(existing) return {invoice:existing,existing:true};
  if(!z.string().email().safeParse(job.customer_email).success||job.address.trim().length<5||job.revenue_cents<=0||job.status==='cancelled') throw new OpsError("Save a client email, service address and positive job price before drafting an invoice. Cancelled jobs cannot be invoiced.");
  const items=[{description:job.title,quantity:1,unit_cents:job.revenue_cents}];
  let totals;
  try{totals=calculateInvoice(items,ctx.business.gst_number,gst_rate);}catch(error){throw new OpsError(error instanceof Error?error.message:"Invalid invoice.");}
  check(await ctx.admin.from("ops_invoices").upsert({source_independent_job_id:id,business_id:ctx.business.id,customer_name:job.customer_name,customer_email:job.customer_email,customer_address:job.address,issuer_name:ctx.business.display_name,issuer_address:ctx.business.address,gst_number:ctx.business.gst_number,items,...totals,due_date:new Date(Date.now()+14*86400000).toISOString().slice(0,10),notes:"Provider-issued invoice for independently sourced work. No Urbance marketplace commission.",created_by:ctx.user.id},{onConflict:"source_independent_job_id",ignoreDuplicates:true}));
  const invoice=check(await ctx.admin.from("ops_invoices").select("*").eq("source_independent_job_id",id).eq("business_id",ctx.business.id).single());
  return {invoice,existing:false};
}
