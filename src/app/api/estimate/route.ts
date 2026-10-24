import {NextResponse} from "next/server";
import {z} from "zod";
import {db,check,guardOrigin,OpsError,safeError} from "@/lib/ops/server";
import {tokenHash} from "@/lib/ops/business-tools";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store, max-age=0","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"};
export async function POST(req:Request){try{
 guardOrigin(req);if(Number(req.headers.get("content-length")||0)>16000)throw new OpsError("Request too large.",413);
 const v=z.object({token:z.string().regex(/^[a-f0-9]{64}$/),action:z.enum(["read","accepted","declined"]),name:z.string().trim().max(150).optional(),consent:z.boolean().optional()}).parse(await req.json());
 const admin=db(),hash=tokenHash(v.token);
 const limited=check(await admin.rpc("ops_take_limit",{p_key:'estimate:'+tokenHash(req.headers.get('x-forwarded-for')||'unknown'),p_limit:60,p_seconds:60}));if(!limited)throw new OpsError("Please wait a minute.",429);
 const estimate=check(await admin.from("ops_estimates").select("id,title,customer_name,issuer_name,scope,exclusions,subtotal_cents,tax_cents,total_cents,status,signer_name,decision_at,expires_at,created_at").eq("token_hash",hash).gt("expires_at",new Date().toISOString()).neq("status","revoked").maybeSingle());
 if(!estimate)throw new OpsError("This estimate link is unavailable or expired. Ask the professional for a new link.",404);
 if(v.action==='read')return NextResponse.json(estimate,{headers});
 if(!v.consent||!v.name||v.name.length<2)throw new OpsError("Enter your name and confirm your decision.");
 const result=await admin.rpc("ops_decide_estimate",{p_hash:hash,p_decision:v.action,p_name:v.name});if(result.error)throw new OpsError("This estimate is no longer available. Refresh to check its status.",409);
 return NextResponse.json(result.data,{headers});
 }catch(e){const err=e instanceof z.ZodError?{error:"Check the information and try again.",status:400}:safeError(e);return NextResponse.json({error:err.error},{status:err.status,headers});}}
