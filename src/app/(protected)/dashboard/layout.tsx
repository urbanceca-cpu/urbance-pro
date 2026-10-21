import { redirect } from "next/navigation";
import { context, identity, db } from "@/lib/ops/server";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let allowed = false;
  try {
    await context();
    allowed = true;
  } catch {}
  if (!allowed) {
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
  return <>{children}</>;
}
