"use client";
import { useState } from "react";
import Link from "next/link";
import PasswordInput from "./PasswordInput";
import { PublicShell } from "./PublicShell";
export default function ResetPassword({
  recovery = false,
}: {
  recovery?: boolean;
}) {
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <PublicShell>
      <div className="pro-container pro-auth-layout">
        <div>
          <span className="pro-kicker">A SECURE WAY BACK</span>
          <h2>
            Back to your
            <br />
            working day.
          </h2>
          <p>
            Use your own verified email. Never share your account or password
            with a team member.
          </p>
        </div>
        <div className="pro-auth-card">
          <h1>{recovery ? "A fresh password." : "Reset your password."}</h1>
          <p>
            {recovery
              ? "Choose at least 12 characters."
              : "We’ll send a reset link if the account can receive one."}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                const response = await fetch("/api/auth/recover", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...values,
                    mode: recovery ? "update" : "request",
                  }),
                });
                const result = await response.json();
                if (!response.ok) throw Error(result.error);
                setMessage(result.message);
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {recovery ? (
              <label>
                New password
                <PasswordInput
                  name="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                />
              </label>
            ) : (
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </label>
            )}
            {message && (
              <p className="pro-notice" role="status">
                {message}
              </p>
            )}
            {error && (
              <p className="pro-error" role="alert">
                {error}
              </p>
            )}
            <button className="pro-button" disabled={busy}>
              {busy
                ? "One moment…"
                : recovery
                  ? "Update password"
                  : "Send reset link"}{" "}
              ↗
            </button>
          </form>
          <Link className="pro-link" href="/login">
            Back to sign-in
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
