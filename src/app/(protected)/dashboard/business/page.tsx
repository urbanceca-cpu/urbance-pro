import Workspace from "@/components/ops/Workspace";
import IndependentBusiness from "@/components/ops/IndependentBusiness";
import { businessRecords } from "@/lib/ops/business-tools";
import { context } from "@/lib/ops/server";
import { independentJobs } from "@/lib/ops/independent";
export default async function Page(){
 const ctx=await context("billing.manage");
 const [jobs,records]=await Promise.all([independentJobs(ctx),businessRecords(ctx)]);
 return <Workspace tab="business"><IndependentBusiness initialJobs={jobs} initialRecords={records}/></Workspace>;
}
