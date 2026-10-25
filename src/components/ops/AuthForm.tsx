"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import PasswordInput from "./PasswordInput";
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}
export async function api<T = Record<string, unknown>>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch("/api/ops/" + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new ApiError(data.error || "Unable to complete your request.", response.status);
  return data;
}
export default function AuthForm({
  mode = "login",
  onSuccess,
}: {
  mode?: "login" | "resume" | "signup" | "invite";
  onSuccess?: () => void;
}) {
  const [current, setCurrent] = useState(mode),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const formRef=useRef<HTMLFormElement>(null);
  function chooseMode(next:typeof current){setCurrent(next);setMessage("");setError("");const input=formRef.current?.elements.namedItem("password") as HTMLInputElement|null;if(input)input.value="";}
  async function resend(){
    const email=(formRef.current?.elements.namedItem("email") as HTMLInputElement|null)?.value||"";
    if(!email){setError("Enter your email first.");return;}
    setBusy(true);setError("");
    try{const r=await fetch("/api/auth/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"resend",email})});const data=await r.json();if(!r.ok)throw new Error(data.error);setMessage(data.message);}catch(e){setError(e instanceof Error?e.message:"Please retry.");}finally{setBusy(false);}
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, mode: current }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      if (data.verifyEmail) {
        setMessage(data.message);
        setCurrent("resume");
        const input=formRef.current?.elements.namedItem("password") as HTMLInputElement|null;if(input)input.value="";
      } else if (onSuccess) onSuccess();
      else location.assign(data.redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="pro-auth-card">
      <span className="pro-kicker">YOUR URBANCE WORKSPACE</span>
      <h1>
        {current === "signup"
          ? "A good place to start."
          : current === "resume"
            ? "Pick up where you left off."
            : current === "invite"
              ? "Join your team."
              : "Welcome back."}
      </h1>
      <p>
        {current === "login"
          ? "Provider sign-in is available after your application is complete. Approved businesses can manage jobs."
          : current === "signup"
            ? "Create your account, verify your email, then complete your application."
            : "Use your existing Urbance email and password—even if this is your first provider application. Your customer and provider profiles share one login."}
      </p>
      {message && (
        <div className="pro-notice" role="status">
          {message}
        </div>
      )}
      {current==="signup"&&<div className="pro-notice"><p>Already use Urbance as a customer or provider?</p><button type="button" className="pro-button pro-button-secondary" onClick={()=>chooseMode("resume")}>Use my existing Urbance account</button></div>}
      <form ref={formRef} onSubmit={submit}>
        {current === "signup" && (
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={150} />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <PasswordInput
            name="password"
            autoComplete={
              current === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={current === "signup" ? 12 : undefined}
            maxLength={128}
          />
        {error && (
          <p className="pro-error" role="alert">
            {error}
          </p>
        )}
        <button className="pro-button" disabled={busy}>
          {busy
            ? "One moment…"
            : current === "signup"
              ? "Create account"
              : current === "resume"
                ? "Resume application"
                : "Sign in"}{" "}
          <span>↗</span>
        </button>
      </form>
      <div className="pro-auth-links">
        {current !== "signup" && (
          <button type="button" onClick={() => chooseMode("signup")}>
            New here? Start an application
          </button>
        )}
        {current !== "resume" && current !== "invite" && (
          <button type="button" onClick={() => chooseMode("resume")}>
            Resume application
          </button>
        )}
        {current !== "login" && current !== "invite" && (
          <button type="button" onClick={() => chooseMode("login")}>
            Already submitted? Provider sign-in
          </button>
        )}
        {(message&&current==="resume")&&<button type="button" disabled={busy} onClick={()=>void resend()}>Resend verification for a new account</button>}
        <Link href="/reset-password">Forgot password?</Link>
      </div>
    </div>
  );
}
