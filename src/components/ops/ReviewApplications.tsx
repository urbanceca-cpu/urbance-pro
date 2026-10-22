"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Application = {
  id: string;
  status: string;
  basic_info: Record<string, unknown>;
  submitted_at: string;
};
type Review = {
  application: Application;
  documents: {
    id: string;
    kind: string;
    original_name: string;
    expires_at: string;
    url: string;
  }[];
  consents: { version: string; accepted_at: string }[];
};
export default function ReviewApplications() {
  const [apps, setApps] = useState<Application[]>([]),
    [selected, setSelected] = useState<Review | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [note, setNote] = useState("");
  async function load() {
    const response = await fetch("/api/ops/admin");
    const data = await response.json();
    if (!response.ok) throw Error(data.error);
    setApps(data.applications);
  }
  useEffect(() => {
    fetch("/api/ops/admin")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setApps(d.applications);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="pro-public pro-container pro-section">
      <Link className="pro-link" href="/admin">
        ← Administration
      </Link>
      <div className="pro-review-header">
        <span className="pro-kicker">URBANCE · AUTHORIZED REVIEW</span>
        <h1>
          Professional starts,
          <br />
          reviewed carefully.
        </h1>
        <p>
          Review the private documents and application declarations. Approve
          only after checking identity, credentials, insurance, applicable
          WorkSafeBC/licences and policy acceptance.
        </p>
      </div>
      {error && <p className="pro-error">{error}</p>}
      <div className="pro-two-col" style={{ alignItems: "start", gap: 30 }}>
        <section className="pro-card">
          {apps.map((app) => (
            <button
              className="pro-job-row"
              key={app.id}
              onClick={async () => {
                setError("");
                const r = await fetch("/api/ops/admin?id=" + app.id);
                const d = await r.json();
                if (r.ok) setSelected(d);
                else setError(d.error);
              }}
            >
              <div>
                <strong>
                  {String(
                    app.basic_info.legal_name ||
                      app.basic_info.full_legal_name ||
                      "Applicant",
                  )}
                </strong>
                <span>{String(app.basic_info.city || "")}</span>
              </div>
              <span className="pro-status">{app.status}</span>
            </button>
          ))}
        </section>
        {selected && (
          <section className="pro-card">
            <h2>Application details</h2>
            <dl className="pro-detail-list">
              {Object.entries(selected.application.basic_info).map(
                ([key, value]) => (
                  <div key={key}>
                    <dt>{key.replaceAll("_", " ")}</dt>
                    <dd>
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </dd>
                  </div>
                ),
              )}
            </dl>
            <h3>Private documents</h3>
            {selected.documents.map((d) => (
              <div className="pro-document-row" key={d.id}>
                <div>
                  <strong>{d.kind.replaceAll("_", " ")}</strong>
                  <span>{d.original_name}</span>
                  <small>Expiry: {d.expires_at || "Not recorded"}</small>
                </div>
                <a href={d.url} target="_blank" rel="noopener noreferrer">
                  Review ↗
                </a>
              </div>
            ))}
            <h3>Agreement record</h3>
            {selected.consents.map((c) => (
              <p key={c.version}>
                Version {c.version} · {new Date(c.accepted_at).toLocaleString()}
              </p>
            ))}
            <label>
              Reviewer note (required)
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                minLength={10}
              />
            </label>
            <div className="pro-actions">
              {["under_review", "approved", "rejected"].map((decision) => (
                <button
                  className={
                    "pro-button " + (decision === "approved" ? "" : "secondary")
                  }
                  key={decision}
                  disabled={busy || note.trim().length < 10}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const r = await fetch("/api/ops/admin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: selected.application.id,
                          decision,
                          note,
                        }),
                      });
                      const data = await r.json();
                      if (!r.ok) throw Error(data.error);
                      setSelected(null);
                      setNote("");
                      await load();
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {decision.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
