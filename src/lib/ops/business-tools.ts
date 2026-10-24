import "server-only";
import {createHash,randomBytes} from "node:crypto";
import {z} from "zod";
import {check,OpsError,type Context} from "./server";
import {independentAccess} from "./independent";
import {calculateInvoice} from "./domain";
export const tokenHash=(token:string)=>createHash("sha256").update(token).digest("hex");
export async function privateJob(ctx:Context,id:string){independentAccess(ctx);const job=check(await ctx.admin.from("ops_independent_jobs").select("*").eq("id",id).eq("business_id",ctx.business.id).maybeSingle());if(!job)throw new OpsError("Private job not found.",404);return job;}
export async function businessRecords(ctx:Context){independentAccess(ctx);const [estimates,entries]=await Promise.all([
 ctx.admin.from("ops_estimates").select("id,private_job_id,title,scope,exclusions,subtotal_cents,tax_cents,total_cents,status,signer_name,decision_at,created_at,expires_at").eq("business_id",ctx.business.id).order("created_at",{ascending:false}).limit(500),
 ctx.admin.from("ops_work_entries").select("id,private_job_id,kind,category,amount_cents,minutes,description,occurred_on,voided,created_at").eq("business_id",ctx.business.id).order("created_at",{ascending:false}).limit(2000)
]);return{estimates:check(estimates)||[],entries:check(entries)||[]};}
export async function publishEstimate(ctx:Context,body:unknown){
 const v=z.object({id:z.string().uuid(),scope:z.string().trim().min(10).max(10000),exclusions:z.string().trim().max(3000).default(""),gst_rate:z.union([z.literal(0),z.literal(.05)])}).parse(body);
 const job=await privateJob(ctx,v.id);if(!job.customer_name||job.revenue_cents<=0)throw new OpsError("Save a client and positive price first.");
 let totals;try{totals=calculateInvoice([{description:job.title,quantity:1,unit_cents:job.revenue_cents}],ctx.business.gst_number,v.gst_rate);}catch(e){throw new OpsError(e instanceof Error?e.message:"Invalid tax.");}
 const token=randomBytes(32).toString("hex");
 const result=await ctx.admin.rpc("ops_publish_estimate",{p_business:ctx.business.id,p_job:job.id,p_actor:ctx.user.id,p_hash:tokenHash(token),p_snapshot:{title:job.title,customer_name:job.customer_name,issuer_name:ctx.business.display_name,scope:v.scope,exclusions:v.exclusions,...totals}});
 if(result.error)throw new OpsError("Unable to publish: this job may already have an approval or invoice. Refresh and review its records.",409);
 return{id:result.data,url:`https://pros.urbance.ca/estimate#${token}`};
}
export const entrySchema=z.object({job_id:z.string().uuid(),request_id:z.string().uuid(),kind:z.enum(["expense","time"]),category:z.enum(["materials","labour","travel","overhead"]),amount_cents:z.number().int().min(0).max(100000000),minutes:z.number().int().min(0).max(1440).default(0),description:z.string().trim().min(2).max(1000),occurred_on:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)}).superRefine((v,c)=>{if(!Number.isFinite(Date.parse(v.occurred_on+"T12:00:00Z"))||new Date(v.occurred_on+"T12:00:00Z").toISOString().slice(0,10)!==v.occurred_on)c.addIssue({code:"custom",message:"Choose a valid date."});if(v.kind==='time'&&(v.minutes<1||v.category!=='labour'))c.addIssue({code:"custom",message:"Time entries require minutes and the labour category."});});
export async function addWorkEntry(ctx:Context,body:unknown){const {job_id,...v}=entrySchema.parse(body);await privateJob(ctx,job_id);check(await ctx.admin.from("ops_work_entries").upsert({...v,business_id:ctx.business.id,private_job_id:job_id,created_by:ctx.user.id},{onConflict:"request_id",ignoreDuplicates:true}));return{saved:true};}
export async function voidWorkEntry(ctx:Context,body:unknown){independentAccess(ctx);const {id}=z.object({id:z.string().uuid()}).parse(body);const row=check(await ctx.admin.from("ops_work_entries").update({voided:true}).eq("id",id).eq("business_id",ctx.business.id).select("id").maybeSingle());if(!row)throw new OpsError("Entry not found.",404);return{saved:true};}

export async function revokeEstimate(ctx:Context,body:unknown){independentAccess(ctx);const {id}=z.object({id:z.string().uuid()}).parse(body);const row=check(await ctx.admin.from("ops_estimates").update({status:"revoked"}).eq("id",id).eq("business_id",ctx.business.id).eq("status","pending").select("id").maybeSingle());if(!row)throw new OpsError("This estimate is unavailable or already has a decision.",409);return{saved:true};}
