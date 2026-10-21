import "server-only";
import { db } from "./server";
export async function businessReady(
  admin: ReturnType<typeof db>,
  owner: string,
  isDemo = false,
) {
  if (isDemo) return true;
  const [{ data: app }, { data: docs }, { data: consent }] = await Promise.all([
    admin
      .from("provider_applications")
      .select("status,basic_info")
      .eq("user_id", owner)
      .maybeSingle(),
    admin
      .from("ops_documents")
      .select("kind,expires_at,verified_at")
      .eq("user_id", owner)
      .not("verified_at", "is", null),
    admin
      .from("ops_consents")
      .select("id")
      .eq("user_id", owner)
      .eq("version", "2026-10-21")
      .maybeSingle(),
  ]);
  if (app?.status !== "approved" || !consent) return false;
  const usable = (docs || [])
    .filter((d) => {
      const expiry =
        d.expires_at ||
        (d.kind === "liability_insurance"
          ? app.basic_info?.insurance_expiry
          : null);
      return !expiry || Date.parse(expiry + "T23:59:59Z") > Date.now();
    })
    .map((d) => d.kind);
  if (
    !["government_id", "liability_insurance", "background_check"].every((k) =>
      usable.includes(k),
    )
  )
    return false;
  if (
    app.basic_info?.worksafe_status === "registered" &&
    !usable.includes("worksafe_clearance")
  )
    return false;
  if (
    (app.basic_info?.categories || []).some((c: string) =>
      ["electrical", "plumbing"].includes(c),
    ) &&
    !usable.includes("trade_licence")
  )
    return false;
  return true;
}
