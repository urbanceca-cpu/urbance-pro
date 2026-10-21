"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "./AuthForm";
import { PublicShell } from "./PublicShell";
import { createClient } from "@/lib/supabase/client";
export default function ApplicationStatus() {
  const [status, setStatus] = useState("Loading…"),
    [error, setError] = useState("");
  useEffect(() => {
    void api<{ application: { status: string } | null }>("application")
      .then((r) => setStatus(r.application?.status || "draft"))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <PublicShell>
      <div className="pro-container pro-section">
        <div className="pro-review pro-card">
          <span className="pro-kicker">YOUR APPLICATION, IN VIEW</span>
          <span className="pro-status">{status.replaceAll("_", " ")}</span>
          <h1 className="pro-page-hero">
            A professional start.
            <br />
            One step at a time.
          </h1>
          {error ? (
            <p className="pro-error">{error}</p>
          ) : (
            <p>
              {status === "approved"
                ? "Your application is approved. Open your workspace to review any outstanding readiness requirements."
                : status === "draft"
                  ? "Finish your application and submit it for review before using the provider workspace."
                  : status === "rejected"
                    ? "Your application needs attention. Contact support for the review details before resubmitting."
                    : "Your submitted application is being reviewed. Our team will contact you if clarification or replacement documentation is needed. Job access begins after approval."}
            </p>
          )}
          <div className="pro-actions">
            <Link
              className="pro-button"
              href={status === "approved" ? "/dashboard" : "/apply"}
            >
              {status === "approved" ? "Open workspace" : "Review application"}{" "}
              ↗
            </Link>
            <a href="mailto:support@urbance.ca">Contact support</a>
            <button
              className="pro-link"
              onClick={async () => {
                await createClient().auth.signOut();
                location.assign("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
