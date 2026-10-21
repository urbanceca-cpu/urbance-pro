import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { guardOrigin, db, check, OpsError, safeError } from "@/lib/ops/server";
import { createHash } from "node:crypto";
export async function POST(req: NextRequest) {
  try {
    guardOrigin(req);
    const v = await req.json();
    const client = await createServerSupabaseClient();
    if (v.mode === "update") {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user)
        throw new OpsError(
          "Open the recovery link from your email first.",
          401,
        );
      if (
        typeof v.password !== "string" ||
        v.password.length < 12 ||
        v.password.length > 128
      )
        throw new OpsError("Use 12 to 128 characters.");
      const { error } = await client.auth.updateUser({ password: v.password });
      if (error)
        throw new OpsError(
          "Unable to update the password. Request a new recovery link.",
        );
      await client.auth.signOut({ scope: "global" });
      return NextResponse.json({
        message: "Password updated. Sign in again with your new password.",
      });
    }
    const email = String(v.email || "")
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      throw new OpsError("Enter your email.");
    const key = createHash("sha256")
      .update(email + (req.headers.get("x-forwarded-for") || ""))
      .digest("hex");
    if (
      !check(
        await db().rpc("ops_take_limit", {
          p_key: "recovery:" + key,
          p_limit: 3,
          p_seconds: 900,
        }),
      )
    )
      throw new OpsError("Please wait before requesting another link.", 429);
    await client.auth.resetPasswordForEmail(email, {
      redirectTo: "https://pros.urbance.ca/auth/callback?flow=recovery",
    });
    return NextResponse.json({
      message:
        "If this address has an eligible account, you’ll receive a recovery email. Check your inbox and spam folder.",
    });
  } catch (error) {
    const e = safeError(error);
    return NextResponse.json({ error: e.error }, { status: e.status });
  }
}
