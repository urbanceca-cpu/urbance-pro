import Workspace from "@/components/ops/Workspace";
import IndependentBusiness from "@/components/ops/IndependentBusiness";
import { context } from "@/lib/ops/server";
import { independentJobs } from "@/lib/ops/independent";
export default async function Page(){
 const ctx=await context("billing.manage");
 const jobs=await independentJobs(ctx);
 return <Workspace tab="business"><IndependentBusiness initialJobs={jobs}/></Workspace>;
}
