"use client";
import { useEffect, useState } from "react";
import AuthForm, { api } from "./AuthForm";
import { PublicShell } from "./PublicShell";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
export default function Invite() {
  const [signed, setSigned] = useState(false),
    [accepted, setAccepted] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => setSigned(!!data.user));
  }, []);
  return (
    <PublicShell>
      <div className="pro-container pro-section">
        <div className="pro-review pro-card">
          <span className="pro-kicker">GOOD WORK, TOGETHER</span>
          <h1>Join your team.</h1>
          <p>
            Invitations are tied to a specific verified email and expire after
            seven days. Use your own account; never share a password.
          </p>
          {!signed ? (
            <AuthForm mode="invite" onSuccess={() => setSigned(true)} />
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await api("invite/accept", {
                    token: new URLSearchParams(location.search).get("token"),
                    accepted,
                  });
                  location.assign("/dashboard");
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label className="pro-checkbox">
                <input
                  type="checkbox"
                  checked={accepted}
                  required
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                I have read and accept the provider terms, privacy policy,
                contractor responsibilities and safety standards applicable to
                my team access.
              </label>
              <div className="pro-policy-links">
                <Link href="/terms" target="_blank">
                  Provider terms ↗
                </Link>
                <Link href="/privacy" target="_blank">
                  Privacy ↗
                </Link>
                <Link href="/contractor-agreement" target="_blank">
                  Contractor responsibilities ↗
                </Link>
                <Link href="/safety" target="_blank">
                  Safety ↗
                </Link>
              </div>
              {error && (
                <p className="pro-error" role="alert">
                  {error}
                </p>
              )}
              <button className="pro-button" disabled={busy || !accepted}>
                Accept team invitation ↗
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
