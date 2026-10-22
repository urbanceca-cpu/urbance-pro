import { Suspense } from "react";
import WorkspaceLoading from "@/components/ops/WorkspaceLoading";
import type { Context } from "@/lib/ops/server";
import { redirect } from "next/navigation";
import { context, identity, db } from "@/lib/ops/server";
import { getWorkspace } from "@/lib/ops/workspace";
import { WorkspaceSession } from "@/components/ops/WorkspaceSession";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let ctx;
  try {
    ctx = await context();
  } catch {
    const user = await identity();
    const { data: app } = await db()
      .from("provider_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (["submitted", "under_review", "approved"].includes(app?.status || ""))
      redirect("/application-status");
    redirect("/apply");
  }
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <Bootstrap ctx={ctx}>{children}</Bootstrap>
    </Suspense>
  );
}

async function Bootstrap({
  ctx,
  children,
}: {
  ctx: Context;
  children: React.ReactNode;
}) {
  const data = await getWorkspace(ctx);
  return <WorkspaceSession initialData={data}>{children}</WorkspaceSession>;
}
