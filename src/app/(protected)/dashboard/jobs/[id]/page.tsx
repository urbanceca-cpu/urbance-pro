import Workspace from "@/components/ops/Workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Workspace tab="jobs" jobId={id} />;
}
