import { redirect } from "next/navigation";
import { identity, db } from "@/lib/ops/server";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await identity();
  const { data: p } = await db()
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!p || !["admin", "super_admin"].includes(p.role)) redirect("/dashboard");
  return <>{children}</>;
}
