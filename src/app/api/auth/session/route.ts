import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { db, guardOrigin, check, OpsError, safeError } from "@/lib/ops/server";
import { createHash } from "node:crypto";
export async function POST(req: NextRequest) {
  try {
    guardOrigin(req);
    const body = await req.json();
    const mode=body.mode||"login";
    if(!["signup","resume","invite","login","resend"].includes(mode)) throw new OpsError("Choose a valid sign-in action.");
    const email = String(body.email || "")
        .trim()
        .toLowerCase(),
      password = String(body.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length > 128)
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
          p_key: (mode==="resend"?"verification:":"login:") + key,
          p_limit: mode==="resend"?3:8,
          p_seconds: 900,
        }),
      )
    )
      throw new OpsError("Too many attempts. Try again in 15 minutes.", 429);
    const client = await createServerSupabaseClient();
    if(mode==="resend"){
      const {error}=await client.auth.resend({type:"signup",email,options:{emailRedirectTo:"https://pros.urbance.ca/auth/callback"}});
      if(error)throw new OpsError("Verification email could not be requested. Try again later or contact support@urbance.ca.",503);
      return NextResponse.json({message:"If this address needs verification, a new email has been requested. Already verified? Continue with your existing Urbance password."});
    }
    if (mode === "signup") {
      if (process.env.OPS_LIVE_ENABLED !== "true")
        throw new OpsError(
          "New provider registrations are temporarily paused during the secure platform upgrade. Contact support@urbance.ca.",
          503,
        );
      // Customer and provider profiles share one Auth identity. Successful
      // password authentication lets an existing verified user continue safely.
      const existing=await client.auth.signInWithPassword({email,password});
      if(!existing.error&&existing.data.user?.email_confirmed_at)
        return NextResponse.json({success:true,redirect:"/apply"});
      if(existing.data?.session)await client.auth.signOut();
      if (password.length < 12)
        throw new OpsError("Use your existing Urbance login, or choose at least 12 characters for a new account.");
      const name = String(body.name || "")
        .trim()
        .slice(0, 150);
      if (!name) throw new OpsError("Enter your full name.");
      const { data: signup, error } = await client.auth.signUp({
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
      if(signup.session&&signup.user?.email_confirmed_at) return NextResponse.json({success:true,redirect:"/apply"});
      return NextResponse.json({
        success: true,
        verifyEmail: true,
        message:
          "New to Urbance? Verify your email if a link arrives, then continue below. Already have an Urbance account? Use its existing password here; a provider application does not need a second login. Use Forgot password if needed.",
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
