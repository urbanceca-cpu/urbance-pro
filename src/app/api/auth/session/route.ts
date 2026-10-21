import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { db, guardOrigin, check, OpsError, safeError } from "@/lib/ops/server";
import { createHash } from "node:crypto";
export async function POST(req: NextRequest) {
  try {
    guardOrigin(req);
    const body = await req.json();
    const email = String(body.email || "")
        .trim()
        .toLowerCase(),
      password = String(body.password || "");
    if (!email || email.length > 254 || password.length > 128)
      throw new OpsError("Enter a valid email and password.");
    const admin = db();
    const key = createHash("sha256")
      .update(
        (req.headers.get("x-forwarded-for") || "unknown").split(",")[0] + email,
      )
      .digest("hex");
    if (
      !check(
        await admin.rpc("ops_take_limit", {
          p_key: "login:" + key,
          p_limit: 8,
          p_seconds: 900,
        }),
      )
    )
      throw new OpsError("Too many attempts. Try again in 15 minutes.", 429);
    const client = await createServerSupabaseClient();
    if (body.mode === "signup") {
      if (process.env.OPS_LIVE_ENABLED !== "true")
        throw new OpsError(
          "New provider registrations are temporarily paused during the secure platform upgrade. Contact support@urbance.ca.",
          503,
        );
      if (password.length < 12)
        throw new OpsError("Choose a password with at least 12 characters.");
      const name = String(body.name || "")
        .trim()
        .slice(0, 150);
      if (!name) throw new OpsError("Enter your full name.");
      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo:
            new URL("/auth/callback", req.url).origin + "/auth/callback",
        },
      });
      if (error)
        throw new OpsError(
          "Unable to create the account. Try signing in or resetting your password.",
        );
      return NextResponse.json({
        success: true,
        verifyEmail: true,
        message:
          "Check your email to verify your address, then resume your application.",
      });
    }
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user)
      throw new OpsError(
        "The email or password is incorrect, or your email is not verified.",
        401,
      );
    if (!data.user.email_confirmed_at) {
      await client.auth.signOut();
      throw new OpsError("Verify your email first.", 403);
    }
    if (body.mode === "resume")
      return NextResponse.json({ success: true, redirect: "/apply" });
    if (body.mode === "invite")
      return NextResponse.json({ success: true, redirect: "/invite" });
    const { data: member } = await admin
      .from("ops_members")
      .select("id,owner_user_id")
      .eq("user_id", data.user.id)
      .eq("active", true)
      .maybeSingle();
    const { data: app } = await admin
      .from("provider_applications")
      .select("status")
      .eq("user_id", data.user.id)
      .maybeSingle();
    let approvedTeamAccess = false;
    if (member && member.owner_user_id !== data.user.id) {
      const { data: ownerApplication } = await admin.from("provider_applications").select("status").eq("user_id",member.owner_user_id).maybeSingle();
      approvedTeamAccess = ownerApplication?.status === "approved";
    }
    if (!approvedTeamAccess && !["submitted", "under_review", "approved"].includes(app?.status || "")) {
      await client.auth.signOut();
      throw new OpsError(
        "Finish and submit your application before using provider sign-in. Choose Resume application to continue.",
        403,
      );
    }
    return NextResponse.json({
      success: true,
      redirect:
        app?.status === "submitted" || app?.status === "under_review"
          ? "/application-status"
          : "/dashboard",
    });
  } catch (error) {
    const e = safeError(error);
    return NextResponse.json({ error: e.error }, { status: e.status });
  }
}
