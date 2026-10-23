"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "./AuthForm";
import { createClient } from "@/lib/supabase/client";
import { CITIES, ROLES, permissionsFor } from "@/lib/ops/domain";

import type {
  Job,
  State,
  Member,
  Business,
  Invoice,
  WorkspaceData,
  JobDetail,
} from "@/lib/ops/workspace-types";
import { useWorkspaceSession } from "./WorkspaceSession";
import { Brand, Icon } from "./Brand";
const money = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    n,
  );
const date = (value: string) =>
  value
    ? new Date(value).toLocaleString("en-CA", {
        timeZone: "America/Vancouver",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
const nav = [
  ["overview", "Overview", "◫"],
  ["jobs", "Job board", "↗"],
  ["business", "My business", "◫"],
  ["team", "Team", "♧"],
  ["invoices", "Invoices", "≡"],
  ["payouts", "Earnings", "＄"],
  ["documents", "Documents", "▤"],
  ["settings", "Settings", "⚙"],
  ["support", "Help & safety", "?"],
];

export default function Workspace({
  tab = "overview",
  jobId,
  children,
}: {
  tab?: string;
  jobId?: string;
  children?: React.ReactNode;
}) {
  const { data, reload: load, error: sessionError } = useWorkspaceSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState(""),
    [detail, setDetail] = useState<JobDetail | null>(null),
    [selected, setSelected] = useState(jobId || "");
  useEffect(() => {
    if (!data?.business.online || !data.permissions.includes("jobs.accept"))
      return;
    const beat = () => {
      if (document.visibilityState === "visible")
        void api("heartbeat", {}).catch(() => {});
    };
    beat();
    const timer = setInterval(beat, 60000);
    return () => clearInterval(timer);
  }, [data?.business.online, data?.permissions.join(",")]);
  useEffect(() => {
    if (!selected) return;
    let live = true;
    const refresh = () =>
      api<JobDetail>("job/" + selected)
        .then((d) => {
          if (live) setDetail(d);
        })
        .catch((e) => {
          if (live) setError(e.message);
        });
    void api<JobDetail>("job/" + selected)
      .then((d) => {
        if (live) setDetail(d);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    const timer = setInterval(() => void refresh(), 20000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [selected]);
  async function action(path: string, body: unknown, message = "Saved.") {
    setBusy(true);
    setError("");
    try {
      const result = await api(path, body);
      setNotice(message);
      await load();
      if (selected) setDetail(await api<JobDetail>("job/" + selected));
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
      return null;
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return (
      <div className="pro-work-loading" role="status">
        <span className="pro-wordmark">urbance</span>
        <h1>Let’s reconnect your workspace.</h1>
        {error || sessionError ? (
          <p className="pro-error">{error || sessionError}</p>
        ) : (
          <div className="pro-skeleton" />
        )}
        <button onClick={() => void load()} className="pro-button secondary">
          Retry
        </button>
        <Link href="/login">Sign in</Link>
      </div>
    );
  const can = (p: string) => data.permissions.includes(p);
  const active = data.jobs.filter(
    (j) => !["completed", "cancelled"].includes(j.job_status),
  );
  const completed = data.jobs.filter((j) => j.job_status === "completed");
  const jobs = data.jobs.filter((j) =>
    (
      j.service_name +
      " " +
      j.service_city +
      " " +
      j.booking_ref +
      " " +
      j.customer_name
    )
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const title = nav.find((n) => n[0] === tab)?.[1] || "Workspace";
  return (
    <div className="pro-workspace">
      <a className="pro-skip" href="#workspace-content">
        Skip to content
      </a>
      <aside className={"pro-sidebar" + (menuOpen ? " is-menu-open" : "")} onKeyDown={e => {
        if (e.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
      }}>
        <Link className="pro-wordmark" href="/">
          <Brand light subtitle="PRO WORKSPACE" />
        </Link>
        <button ref={menuButton} type="button" className="pro-work-menu" aria-controls="workspace-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
          {menuOpen ? "Close" : "Menu"}
        </button>
        <div className="pro-business-chip">
          <span><img src="/brand/symbol-white.png" alt="" width="18" height="20" /></span>
          <div>
            <strong>{data.business.display_name}</strong>
            <small>
              {data.business.mode === "team"
                ? "Team workspace"
                : "Independent professional"}
            </small>
          </div>
        </div>
        <span className="pro-sidebar-label">YOUR BUSINESS</span>
        <nav id="workspace-navigation" aria-label="Workspace navigation">
          {nav
            .filter(
              ([key]) =>
                key !== "team" || can("team.manage") || can("team.track"),
            )
            .filter(
              ([key]) =>
                (key !== "invoices" && key !== "payouts" && key !== "business") ||
                can("billing.manage"),
            )
            .filter(([key]) => key !== "settings" || can("settings.manage"))
            .filter(([key]) => key !== "documents" || can("documents.manage"))
            .map(([key, label]) => (
              <Link
                key={key}
                onClick={() => setMenuOpen(false)}
                href={"/dashboard" + (key === "overview" ? "" : "/" + key)}
                aria-current={tab === key ? "page" : undefined}
              >
                <Icon name={key} />
                {label}
                {key === "jobs" && data.offers.length > 0 && (
                  <b>{data.offers.length}</b>
                )}
              </Link>
            ))}
        </nav>
        <div className="pro-sidebar-bottom">
          <span className="pro-kicker">GOOD WORK STARTS HERE</span>
          <p>
            Clarity for the details.
            <br />
            Room for the craft.
          </p>
          <a className="pro-customer-link" href="https://www.urbance.ca">
            Visit customer website <Icon name="external" />
          </a>
          <button
            onClick={async () => {
              await createClient().auth.signOut();
              location.assign("/login");
            }}
          >
            Sign out ↗
          </button>
        </div>
      </aside>
      <div className="pro-work-area">
        <header className="pro-work-header">
          <div>
            <span className="pro-kicker">
              {data.business.city.toUpperCase()} · BRITISH COLUMBIA
            </span>
            <strong>{data.business.display_name}</strong>
          </div>
          <a className="pro-work-customer" href="https://www.urbance.ca">
            Urbance home <Icon name="external" />
          </a>
          <span
            className={"pro-presence " + (data.business.online ? "online" : "")}
          >
            {data.business.online ? "● Available for offers" : "○ Offline"}
          </span>
          <Link
            href="/dashboard/settings"
            className="pro-avatar"
            aria-label="Your workspace settings"
          >
            {data.member.name?.slice(0, 1) || "U"}
          </Link>
        </header>
        <main id="workspace-content" className="pro-work-content">
          {data.business.is_demo && (
            <div className="pro-demo-banner">
              DEMO WORKSPACE · Fictional jobs only. No external emails or
              payments. Changes stay within this demo business.
            </div>
          )}
          {!data.ready && (
            <div className="pro-notice">
              Your current documents or agreement review needs attention before
              new job offers are enabled.{" "}
              <Link href="/dashboard/documents">Review documents ↗</Link>
            </div>
          )}
          <div className="pro-work-heading">
            <div>
              <span className="pro-kicker">
                {tab === "overview"
                  ? "YOUR DAY, AT A GLANCE"
                  : "YOUR URBANCE BUSINESS"}
              </span>
              <h1>
                {tab === "overview"
                  ? `Good work, ${data.member.name.split(" ")[0]}.`
                  : title}
              </h1>
              <p>
                {tab === "overview"
                  ? "A clear view of what’s next. All the details, in one place."
                  : tab === "jobs"
                    ? "Matched requests and the work you’re taking care of."
                    : tab === "team"
                      ? "The right people. The right access."
                      : tab === "invoices"
                        ? "Provider-issued invoices, with the details made clear."
                        : "Keep your working day connected."}
              </p>
            </div>
            {tab === "jobs" && (
              <label className="pro-search">
                <span className="sr-only">Search jobs</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs, city or reference"
                />
              </label>
            )}
          </div>
          {(error || sessionError) && (
            <div className="pro-error" role="alert">
              {error || sessionError}
            </div>
          )}
          {notice && (
            <div className="pro-notice" role="status">
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}
          {tab === "overview" && (
            <>
              <section className="pro-day-banner">
                <div>
                  <span className="pro-kicker">MAKE TODAY A GOOD WORK DAY</span>
                  <h2>
                    Your next chapter
                    <br />
                    starts with your next job.
                  </h2>
                  <p>
                    Stay available, review the details, and take on the work
                    that fits.
                  </p>
                  <Link className="pro-button" href="/dashboard/jobs">
                    Explore your job board <Icon name="external" />
                  </Link>
                </div>
                <img
                  src="/images/pro/team.webp"
                  alt="Home service teammates planning their working day"
                  width="640"
                  height="420"
                />
              </section>
              <div className="pro-stat-grid">
                {[
                  [
                    "Ready for you",
                    String(data.offers.length),
                    "Matching job offers",
                  ],
                  ["On your calendar", String(active.length), "Active jobs"],
                  [
                    "Work completed",
                    String(completed.length),
                    "Completed jobs",
                  ],
                  [
                    "Estimated earnings",
                    money(
                      completed.reduce(
                        (s, j) => s + Number(j.price || j.payout_amount) * 0.93,
                        0,
                      ),
                    ),
                    "After 7% commission · before adjustments",
                  ],
                ].map(([label, value, sub]) => (
                  <article className="pro-stat" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{sub}</small>
                  </article>
                ))}
              </div>
              <div className="pro-dashboard-grid">
                <section className="pro-card">
                  <div className="pro-card-heading">
                    <h2>Coming up</h2>
                    <Link href="/dashboard/jobs">View all ↗</Link>
                  </div>
                  {active.length ? (
                    active.slice(0, 4).map((j) => (
                      <JobRow
                        key={j.id}
                        job={j}
                        state={data.states.find((s) => s.job_id === j.id)}
                        onOpen={() => {
                          setSelected(j.id);
                        }}
                      />
                    ))
                  ) : (
                    <Empty
                      title="A little room in your calendar."
                      copy="Accepted jobs appear here. Go online in Settings when you’re ready for offers."
                    />
                  )}
                </section>
                <section className="pro-card pro-blue-card">
                  <span className="pro-kicker">YOUR NEXT OPPORTUNITY</span>
                  <h2>
                    {data.offers.length
                      ? "Good work is waiting."
                      : "Ready when you are."}
                  </h2>
                  <p>
                    Offers match your category and city. Nearby requests may
                    open when local availability is limited or a request remains
                    unclaimed.
                  </p>
                  <Link className="pro-button" href="/dashboard/jobs">
                    Open job board ↗
                  </Link>
                  <small>
                    Stay online with this workspace open to receive new offers.
                  </small>
                </section>
              </div>
              <section className="pro-card">
                <div className="pro-card-heading">
                  <h2>Keep your business ready</h2>
                  <Link href="/dashboard/documents">Review documents ↗</Link>
                </div>
                <div className="pro-readiness">
                  <span>✓ Application approved</span>
                  <span>✓ Individual team permissions</span>
                  <span>
                    {data.business.online
                      ? "● Available for matching jobs"
                      : "○ Availability is off"}
                  </span>
                </div>
              </section>
            </>
          )}
          {tab === "jobs" && (
            <>
              <section className="pro-card">
                <div className="pro-card-heading">
                  <h2>
                    Available requests{" "}
                    <span className="pro-count">{data.offers.length}</span>
                  </h2>
                  <span className="pro-hint">
                    First acceptance confirms assignment
                  </span>
                </div>
                {data.offers.length ? (
                  <div className="pro-offer-grid">
                    {data.offers.map((o) => (
                      <article className="pro-offer" key={o.id}>
                        <span className="pro-kicker">
                          {o.wave === "nearby"
                            ? "NEARBY CITY"
                            : "MATCHED TO YOUR CITY"}
                        </span>
                        <h3>{o.service}</h3>
                        <p>
                          {o.city} · {o.date}
                          <br />
                          {o.time || "Time to be confirmed"}
                        </p>
                        {o.scope?.length > 0 && (
                          <ul className="pro-offer-scope">
                            {o.scope.map((line, index) => (
                              <li key={index}>{line}</li>
                            ))}
                          </ul>
                        )}
                        <dl>
                          <div>
                            <dt>Job amount</dt>
                            <dd>{money(o.gross)}</dd>
                          </div>
                          <div>
                            <dt>Urbance commission (7%)</dt>
                            <dd>{money(o.gross * 0.07)}</dd>
                          </div>
                          <div>
                            <dt>Your estimated earnings</dt>
                            <dd>{money(o.net)}</dd>
                          </div>
                        </dl>
                        <p className="pro-hint">
                          Exact address and customer details unlock after
                          acceptance.
                        </p>
                        <button
                          className="pro-button"
                          disabled={busy}
                          onClick={() =>
                            void action(
                              "accept",
                              { job_id: o.id },
                              "Job accepted. Customer details are now available.",
                            )
                          }
                        >
                          Accept request ↗
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title={
                      data.business.online
                        ? "No matching requests right now."
                        : "You’re currently offline."
                    }
                    copy="Choose your availability in Settings. We’ll show eligible requests for your category and service area."
                  />
                )}
              </section>
              <section className="pro-card">
                <div className="pro-card-heading">
                  <h2>Your jobs</h2>
                  <span>{jobs.length} jobs</span>
                </div>
                {jobs.length ? (
                  jobs.map((j) => (
                    <JobRow
                      key={j.id}
                      job={j}
                      state={data.states.find((s) => s.job_id === j.id)}
                      onOpen={() => setSelected(j.id)}
                    />
                  ))
                ) : (
                  <Empty
                    title="Your next chapter starts with a job."
                    copy="Accepted and assigned jobs appear here."
                  />
                )}
              </section>
            </>
          )}
          {tab === "team" && <Team data={data} busy={busy} action={action} />}
          {tab === "settings" && can("settings.manage") && (
            <Settings business={data.business} busy={busy} action={action} />
          )}
          {children}
          {tab === "invoices" && can("billing.manage") && (
            <Invoices data={data} busy={busy} action={action} />
          )}
          {tab === "payouts" && can("billing.manage") && (
            <section className="pro-card">
              <h2>Earnings, made clear.</h2>
              <p>
                Marketplace jobs carry a 7% commission. These figures estimate
                earnings from completed jobs; they do not confirm a bank
                transfer or payment settlement.
              </p>
              <div className="pro-stat-grid">
                <article className="pro-stat">
                  <span>Completed job value</span>
                  <strong>
                    {money(
                      completed.reduce(
                        (s, j) => s + Number(j.price || j.payout_amount),
                        0,
                      ),
                    )}
                  </strong>
                </article>
                <article className="pro-stat">
                  <span>Estimated net earnings</span>
                  <strong>
                    {money(
                      completed.reduce(
                        (s, j) => s + Number(j.price || j.payout_amount) * 0.93,
                        0,
                      ),
                    )}
                  </strong>
                </article>
              </div>
              {completed.map((j) => (
                <JobRow
                  key={j.id}
                  job={j}
                  state={data.states.find((s) => s.job_id === j.id)}
                  onOpen={() => setSelected(j.id)}
                />
              ))}
              <p className="pro-hint">
                Refunds, disputes, taxes and adjustments may affect final
                settlement. Contact support for payout reconciliation.
              </p>
            </section>
          )}
          {tab === "documents" && can("documents.manage") && (
            <section className="pro-card">
              <h2>Your credentials</h2>
              <p>
                Private files with expiring access links. Replacement documents
                are reviewed; an upload is not a verification decision.
              </p>
              {data.documents.map((d) => (
                <div className="pro-document-row" key={d.id}>
                  <div>
                    <strong>{d.kind.replaceAll("_", " ")}</strong>
                    <span>{d.original_name}</span>
                    <small>
                      {d.expires_at
                        ? "Expires " + d.expires_at
                        : "No expiry recorded"}{" "}
                      · {d.verified_at ? "Reviewed" : "Pending review"}
                    </small>
                  </div>
                  <button
                    className="pro-button secondary"
                    onClick={async () => {
                      try {
                        const result = await api<{ url: string }>(
                          "document/" + d.id,
                        );
                        window.open(result.url, "_blank", "noopener");
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }}
                  >
                    Open ↗
                  </button>
                </div>
              ))}
              <p className="pro-hint">
                To renew, choose the document category, upload a current
                original and enter its expiry.
              </p>
              <DocumentReplacement
                onDone={() => void load()}
                onError={setError}
              />
            </section>
          )}
          {tab === "support" && (
            <section className="pro-card">
              <span className="pro-kicker">PEOPLE WHEN YOU NEED THEM</span>
              <h2>We’re here for the details.</h2>
              <p>
                For booking issues, incidents, scope changes, privacy requests
                or document corrections, contact our team. For immediate danger
                or a medical emergency, call 911 first.
              </p>
              <a className="pro-button" href="mailto:support@urbance.ca">
                Email support ↗
              </a>
              <div className="pro-policy-links">
                <Link href="/terms">Provider terms ↗</Link>
                <Link href="/contractor-agreement">Contractor agreement ↗</Link>
                <Link href="/privacy">Privacy policy ↗</Link>
                <Link href="/safety">Safety standards ↗</Link>
              </div>
              <h3>Operational emails</h3>
              <p>
                {data.emailConfigured
                  ? "The company email sender is connected. Delivery attempts and retries are recorded."
                  : "Company sender setup is pending. Notifications are queued; delivery is not enabled yet."}
              </p>
              {data.notifications.map((n) => (
                <div className="pro-document-row" key={n.id}>
                  <strong>{n.subject}</strong>
                  <span className="pro-status">{n.status}</span>
                </div>
              ))}
            </section>
          )}
          {detail && selected && (
            <JobPanel
              detail={detail}
              data={data}
              busy={busy}
              action={action}
              onClose={() => {
                setSelected("");
                setDetail(null);
              }}
              refresh={async () => {
                setDetail(await api<JobDetail>("job/" + selected));
              }}
              onError={setError}
            />
          )}
        </main>
        <footer className="pro-work-footer">
          <a href="https://www.urbance.ca">Visit customer website ↗</a>
          Urbance Technologies Inc. · Your business, thoughtfully connected.{" "}
          <a href="mailto:support@urbance.ca">Get help ↗</a>
        </footer>
      </div>
    </div>
  );
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="pro-empty">
      <span aria-hidden="true">↗</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}
function JobRow({
  job,
  state,
  onOpen,
}: {
  job: Job;
  state: State | undefined;
  onOpen: () => void;
}) {
  return (
    <button className="pro-job-row" onClick={onOpen}>
      <span className="pro-job-icon" aria-hidden="true">
        ↗
      </span>
      <div>
        <strong>{job.service_name || job.service_type}</strong>
        <span>
          {job.service_city} · {job.scheduled_date} ·{" "}
          {job.scheduled_time || "Time to confirm"}
        </span>
        <small>{job.booking_ref || job.id.slice(0, 8)}</small>
      </div>
      <span className="pro-status">
        {(state?.phase || job.job_status).replaceAll("_", " ")}
      </span>
      <b>{money(Number(job.price || job.payout_amount) * 0.93)}</b>
      <span aria-hidden="true">→</span>
    </button>
  );
}

type Action = (
  path: string,
  body: unknown,
  message?: string,
) => Promise<Record<string, unknown> | null>;
function Settings({
  business,
  busy,
  action,
}: {
  business: Business;
  busy: boolean;
  action: Action;
}) {
  const [form, setForm] = useState(business);
  return (
    <form
      className="pro-card"
      onSubmit={(e) => {
        e.preventDefault();
        void action("settings", form, "Business settings saved.");
      }}
    >
      <h2>Work your way.</h2>
      <p>
        Choose your business setup, service radius and availability. Category
        changes require credential review through support.
      </p>
      <div className="pro-form-grid">
        <label>
          Business setup
          <select
            value={form.mode}
            onChange={(e) =>
              setForm({ ...form, mode: e.target.value as Business["mode"] })
            }
          >
            <option value="individual">Individual contractor</option>
            <option value="team">Business with a team</option>
          </select>
        </label>
        <label>
          Home city
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            {Object.keys(CITIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Business name
          <input
            value={form.display_name}
            required
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          />
        </label>
        <label>
          Mailing address
          <input
            value={form.address}
            required
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={form.phone}
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          Nearby travel radius (km)
          <input
            type="number"
            min="0"
            max="100"
            value={form.max_travel_km}
            onChange={(e) =>
              setForm({ ...form, max_travel_km: Number(e.target.value) })
            }
          />
        </label>
        <label>
          GST registration number (if registered)
          <input
            value={form.gst_number}
            placeholder="123456789RT0001"
            onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
          />
        </label>
      </div>
      <label className="pro-checkbox">
        <input
          type="checkbox"
          checked={form.online}
          onChange={(e) => setForm({ ...form, online: e.target.checked })}
        />
        Available for job requests. Keep your workspace open to maintain your
        active presence.
      </label>
      <label className="pro-checkbox">
        <input
          type="checkbox"
          checked={form.repeat_offer_emails}
          onChange={(e) =>
            setForm({ ...form, repeat_offer_emails: e.target.checked })
          }
        />
        Email me open job offers every 30 minutes until accepted, cancelled or
        expired. I can turn these alerts off here.
      </label>
      <button className="pro-button" disabled={busy}>
        Save settings ↗
      </button>
    </form>
  );
}

function Team({
  data,
  busy,
  action,
}: {
  data: WorkspaceData;
  busy: boolean;
  action: Action;
}) {
  const [role, setRole] = useState("technician"),
    [grants, setGrants] = useState<string[]>([...ROLES.technician]),
    [link, setLink] = useState("");
  const manage = data.permissions.includes("team.manage");
  return (
    <>
      <section className="pro-card">
        <h2>Your people, together.</h2>
        <p>
          Each person uses their own verified account. Owners control access.
          Technicians see only assigned jobs; billing access and location
          visibility are separate.
        </p>
        {data.members.map((m) => (
          <div className="pro-team-row" key={m.id}>
            <span className="pro-avatar">{m.name.slice(0, 1)}</span>
            <div>
              <strong>{m.name}</strong>
              <span>{m.email}</span>
              <small>{permissionsFor(m.role, m.permissions).join(" · ")}</small>
            </div>
            <span className="pro-status">
              {m.role} · {m.active ? "active" : "inactive"}
            </span>
            {manage && m.role !== "owner" && (
              <>
                <select
                  aria-label={"Role for " + m.name}
                  value={m.role}
                  disabled={busy}
                  onChange={(e) =>
                    void action(
                      "team/update",
                      {
                        id: m.id,
                        role: e.target.value,
                        active: m.active,
                        permissions: ROLES[e.target.value],
                      },
                      "Team role updated.",
                    )
                  }
                >
                  {Object.keys(ROLES)
                    .filter((r) => r !== "owner")
                    .map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                </select>
                <button
                  className="pro-link"
                  disabled={busy}
                  onClick={() =>
                    void action(
                      "team/update",
                      {
                        id: m.id,
                        role: m.role,
                        permissions: m.permissions,
                        active: !m.active,
                      },
                      "Team access updated.",
                    )
                  }
                >
                  {m.active ? "Deactivate" : "Reactivate"}
                </button>
              </>
            )}
          </div>
        ))}
      </section>
      {manage && data.business.mode === "team" && (
        <form
          className="pro-card"
          onSubmit={async (e) => {
            e.preventDefault();
            const fields = Object.fromEntries(new FormData(e.currentTarget));
            const result = await action(
              "team/invite",
              { ...fields, role, permissions: grants },
              "Invitation created.",
            );
            if (result?.invitationLink) setLink(String(result.invitationLink));
          }}
        >
          <h2>Invite someone good.</h2>
          <div className="pro-form-grid">
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Team role
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setGrants([...ROLES[e.target.value]]);
                }}
              >
                {Object.keys(ROLES)
                  .filter((r) => r !== "owner")
                  .map((r) => (
                    <option key={r}>{r}</option>
                  ))}
              </select>
            </label>
          </div>
          <p>Choose the access available within this role.</p>
          <div className="pro-choice-grid">
            {ROLES[role].map((p) => (
              <label key={p} className="pro-checkbox">
                <input
                  type="checkbox"
                  checked={grants.includes(p)}
                  onChange={(e) =>
                    setGrants(
                      e.target.checked
                        ? [...grants, p]
                        : grants.filter((x) => x !== p),
                    )
                  }
                />
                {p.replaceAll(".", " · ")}
              </label>
            ))}
          </div>
          <button className="pro-button" disabled={busy}>
            Create invitation ↗
          </button>
          {link && (
            <div className="pro-notice">
              <label>
                One-time invitation link (7 days)
                <input
                  readOnly
                  value={link}
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <p>
                Share only with the invited person. Acceptance requires their
                verified email.
              </p>
            </div>
          )}
        </form>
      )}
      {data.permissions.includes("team.track") && (
        <section className="pro-card">
          <h2>Team on the move</h2>
          <p>
            Location is shared only by the assigned professional during an
            active job. Updates are approximate and timestamped.
          </p>
          {data.states
            .filter((s) => s.sharing_location && s.location_at)
            .map((s) => (
              <div key={s.job_id} className="pro-document-row">
                <div>
                  <strong>
                    {data.members.find((m) => m.user_id === s.assigned_user_id)
                      ?.name || "Assigned professional"}
                  </strong>
                  <span>
                    {s.phase.replaceAll("_", " ")} · last shared{" "}
                    {date(s.location_at)}
                  </span>
                </div>
                <a
                  className="pro-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`}
                >
                  View on map ↗
                </a>
              </div>
            ))}
        </section>
      )}
    </>
  );
}

function Invoices({
  data,
  busy,
  action,
}: {
  data: WorkspaceData;
  busy: boolean;
  action: Action;
}) {
  const [items, setItems] = useState([
      { description: "", quantity: 1, unit_cents: 0 },
    ]),
    [gst, setGst] = useState(0);
  return (
    <>
      <form
        className="pro-card"
        onSubmit={(e) => {
          e.preventDefault();
          const fields = Object.fromEntries(new FormData(e.currentTarget));
          void action(
            "invoice/create",
            { ...fields, items, gst_rate: gst },
            "Invoice draft created. Review it before sending.",
          );
        }}
      >
        <h2>A clear invoice. A professional finish.</h2>
        <p>
          Supplier: <strong>{data.business.display_name}</strong>. Generated
          through Urbance. This tool records invoices; it does not collect
          payment or charge a customer’s card.
        </p>
        <div className="pro-form-grid">
          <label>
            Customer name
            <input name="customer_name" required />
          </label>
          <label>
            Customer email
            <input name="customer_email" type="email" required />
          </label>
          <label>
            Billing address
            <input name="customer_address" required />
          </label>
          <label>
            Due date
            <input
              name="due_date"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
        </div>
        {items.map((item, index) => (
          <div className="pro-invoice-item" key={index}>
            <label>
              Description
              <input
                value={item.description}
                required
                onChange={(e) =>
                  setItems(
                    items.map((x, n) =>
                      n === index ? { ...x, description: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={item.quantity}
                onChange={(e) =>
                  setItems(
                    items.map((x, n) =>
                      n === index
                        ? { ...x, quantity: Number(e.target.value) }
                        : x,
                    ),
                  )
                }
              />
            </label>
            <label>
              Unit price (CAD)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={item.unit_cents / 100}
                onChange={(e) =>
                  setItems(
                    items.map((x, n) =>
                      n === index
                        ? {
                            ...x,
                            unit_cents: Math.round(
                              Number(e.target.value) * 100,
                            ),
                          }
                        : x,
                    ),
                  )
                }
              />
            </label>
            {items.length > 1 && (
              <button
                type="button"
                className="pro-link"
                onClick={() => setItems(items.filter((_, n) => n !== index))}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="pro-link"
          onClick={() =>
            setItems([
              ...items,
              { description: "", quantity: 1, unit_cents: 0 },
            ])
          }
        >
          + Add line item
        </button>
        <label>
          Tax
          <select value={gst} onChange={(e) => setGst(Number(e.target.value))}>
            <option value={0}>No tax charged</option>
            <option value={0.05} disabled={!data.business.gst_number}>
              5% GST — requires registration in Settings
            </option>
          </select>
        </label>
        <label>
          Payment instructions / notes
          <textarea
            name="notes"
            maxLength={1500}
            placeholder="State how the supplier accepts payment. Do not include bank passwords or card details."
          />
        </label>
        <p className="pro-hint">
          This invoice flow supports BC CAD invoices with zero tax or 5% GST.
          Confirm the correct tax treatment before sending; other tax regimes
          require review.
        </p>
        <button className="pro-button" disabled={busy}>
          Generate draft ↗
        </button>
      </form>
      <section className="pro-card">
        <h2>Invoice register</h2>
        {data.invoices.map((i) => (
          <article className="pro-invoice-row" key={i.id}>
            <div>
              <strong>{i.invoice_number}</strong>
              <span>
                {i.customer_name} · Due {i.due_date}
              </span>
              <small>
                {i.issuer_name} · {i.status}
              </small>
            </div>
            <b>{money(i.total_cents / 100)}</b>
            <button className="pro-link" onClick={() => printInvoice(i)}>
              View / print
            </button>
            {i.status === "draft" && (
              <button
                className="pro-button secondary"
                disabled={busy}
                onClick={() =>
                  void action(
                    "invoice/update",
                    { id: i.id, status: "sent" },
                    data.business.is_demo
                      ? "Demo invoice marked sent. No email was sent."
                      : "Invoice email queued for the customer.",
                  )
                }
              >
                Send invoice
              </button>
            )}
            {i.status === "sent" && (
              <button
                className="pro-button secondary"
                disabled={busy}
                onClick={() =>
                  void action(
                    "invoice/update",
                    { id: i.id, status: "paid" },
                    "Invoice marked paid. No money was transferred.",
                  )
                }
              >
                Record payment
              </button>
            )}
            {["draft", "sent"].includes(i.status) && (
              <button
                className="pro-link"
                disabled={busy}
                onClick={() =>
                  void action(
                    "invoice/update",
                    { id: i.id, status: "void" },
                    "Invoice voided.",
                  )
                }
              >
                Void
              </button>
            )}
          </article>
        ))}
      </section>
    </>
  );
}

function printInvoice(i: Invoice) {
  const escape = (v: unknown) =>
    String(v || "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
  const html = `<!doctype html><html><head><title>${escape(i.invoice_number)}</title><style>body{font:15px/1.6 system-ui;color:#172b41;max-width:820px;margin:60px auto;padding:24px}h1{color:#2f80ed}table{width:100%;border-collapse:collapse;margin-top:30px}td,th{text-align:left;padding:12px;border-bottom:1px solid #ddd}.total{font-size:24px}small{color:#657580}</style></head><body><h1>${escape(i.issuer_name)}</h1><p>${escape(i.issuer_address)}</p><h2>Invoice ${escape(i.invoice_number)} · ${escape(i.status)}</h2><p>Issued ${escape(i.issued_date)} · Due ${escape(i.due_date)}</p><h3>Bill to</h3><p>${escape(i.customer_name)}<br>${escape(i.customer_email)}<br>${escape(i.customer_address)}</p><table><thead><tr><th>Description</th><th>Qty</th><th>Unit price (CAD)</th><th>Amount</th></tr></thead><tbody>${i.items.map((x) => `<tr><td>${escape(x.description)}</td><td>${x.quantity}</td><td>${money(x.unit_cents / 100)}</td><td>${money(Math.round(x.quantity * x.unit_cents) / 100)}</td></tr>`).join("")}</tbody></table><p>Subtotal ${money(i.subtotal_cents / 100)}<br>GST ${money(i.tax_cents / 100)}${i.gst_number ? "<br>GST registration " + escape(i.gst_number) : ""}</p><p class="total">Total CAD ${money(i.total_cents / 100)}</p><p>${escape(i.notes)}</p><small>Supplier: ${escape(i.issuer_name)}. Generated through Urbance Technologies Inc. Payment is arranged with the supplier. This document does not charge your card.</small></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function DocumentReplacement({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (s: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const form = new FormData(e.currentTarget);
        try {
          const response = await fetch("/api/ops/upload", {
            method: "POST",
            body: form,
          });
          const result = await response.json();
          if (!response.ok) throw Error(result.error);
          onDone();
        } catch (e) {
          onError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="pro-form-grid">
        <label>
          Document type
          <select name="kind">
            {[
              "government_id",
              "liability_insurance",
              "background_check",
              "worksafe_clearance",
              "trade_licence",
              "business_licence",
            ].map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Expiry date
          <input type="date" name="expires_at" />
        </label>
        <label>
          File (up to 4 MB)
          <input
            name="file"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            required
          />
        </label>
      </div>
      <button className="pro-button" disabled={busy}>
        Upload replacement
      </button>
    </form>
  );
}

function JobPanel({
  detail,
  data,
  busy,
  action,
  onClose,
  refresh,
  onError,
}: {
  detail: JobDetail;
  data: WorkspaceData;
  busy: boolean;
  action: Action;
  onClose: () => void;
  refresh: () => Promise<void>;
  onError: (s: string) => void;
}) {
  const { job, state } = detail;
  const [eta, setEta] = useState(state.eta_minutes || 20),
    [phase, setPhase] = useState("before"),
    [caption, setCaption] = useState(""),
    [uploading, setUploading] = useState(false),
    [sharing, setSharing] = useState(false);
  const watch = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const canWork =
    data.permissions.includes("jobs.work") &&
    (data.member.role !== "technician" ||
      state.assigned_user_id === data.member.user_id);
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = panel.current?.querySelectorAll<HTMLElement>(
          'a,button,input,select,textarea,[tabindex="0"]',
        );
        const active = Array.from(nodes || []).filter(
          (n) => !n.hasAttribute("disabled"),
        );
        if (!active.length) return;
        if (e.shiftKey && document.activeElement === active[0]) {
          e.preventDefault();
          active[active.length - 1].focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === active[active.length - 1]
        ) {
          e.preventDefault();
          active[0].focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      before?.focus();
    };
  }, [onClose]);
  useEffect(
    () => () => {
      if (watch.current !== null)
        navigator.geolocation.clearWatch(watch.current);
      void api("job/location", { job_id: job.id, sharing: false }).catch(
        () => {},
      );
    },
    [job.id],
  );
  useEffect(() => {
    if (state.phase === "completed" && watch.current !== null) {
      navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
      setSharing(false);
    }
  }, [state.phase]);
  function toggleLocation() {
    if (sharing) {
      if (watch.current !== null)
        navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
      setSharing(false);
      void api("job/location", { job_id: job.id, sharing: false });
      return;
    }
    if (!navigator.geolocation) {
      onError("Location is unavailable in this browser.");
      return;
    }
    watch.current = navigator.geolocation.watchPosition(
      (pos) => {
        setSharing(true);
        void api("job/location", {
          job_id: job.id,
          sharing: true,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }).catch((e) => onError(e.message));
      },
      () => {
        setSharing(false);
        onError(
          "Location permission was denied or unavailable. You can still open navigation and enter an ETA.",
        );
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 },
    );
  }
  const next: Record<string, [string, string]> = {
    accepted: ["en_route", "Start travelling"],
    en_route: ["arrived", "Mark arrived"],
    arrived: ["in_progress", "Start job"],
    in_progress: ["completed", "Complete job"],
  };
  return (
    <div
      className="pro-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        className="pro-job-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title"
        tabIndex={-1}
      >
        <div className="pro-card-heading">
          <span className="pro-kicker">
            {job.booking_ref || job.id.slice(0, 8)} · {job.service_city}
          </span>
          <button
            className="pro-close"
            onClick={onClose}
            aria-label="Close job"
          >
            ×
          </button>
        </div>
        <h2 id="job-title">{job.service_name || job.service_type}</h2>
        <span className="pro-status">{state.phase.replaceAll("_", " ")}</span>
        <dl className="pro-detail-list">
          <div>
            <dt>Customer</dt>
            <dd>
              {job.customer_name}{" "}
              {job.customer_phone && (
                <a href={"tel:" + job.customer_phone}> · Call ↗</a>
              )}
            </dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{job.address || job.service_address}</dd>
          </div>
          <div>
            <dt>Schedule</dt>
            <dd>
              {job.scheduled_date} · {job.scheduled_time}
            </dd>
          </div>
          <div>
            <dt>Estimated earnings</dt>
            <dd>
              {money(Number(job.price || job.payout_amount) * 0.93)} after 7%
              commission
            </dd>
          </div>
          <div>
            <dt>Scope & notes</dt>
            <dd>{job.service_details || job.notes || "See booking scope."}</dd>
          </div>
        </dl>
        {detail.booking && (
          <details className="pro-scope">
            <summary>View the customer’s booking selections</summary>
            <pre>{JSON.stringify(detail.booking.selections, null, 2)}</pre>
          </details>
        )}
        <div className="pro-actions">
          <a
            className="pro-button secondary"
            target="_blank"
            rel="noopener noreferrer"
            href={
              "https://www.google.com/maps/dir/?api=1&destination=" +
              encodeURIComponent(job.address || job.service_address) +
              "&travelmode=driving"
            }
          >
            Open driving directions ↗
          </a>
          {canWork &&
            ["en_route", "arrived", "in_progress"].includes(state.phase) && (
              <button className="pro-link" onClick={toggleLocation}>
                {sharing
                  ? "Stop sharing location"
                  : "Share my active-job location"}
              </button>
            )}
        </div>
        <p className="pro-hint">
          Navigation provides live route guidance in your map app. Workspace ETA
          is a provider estimate. Location is shared only while this job panel
          is open and permission remains enabled.
        </p>
        {canWork && next[state.phase] && (
          <div className="pro-stage-action">
            <label>
              Estimated travel time (minutes)
              <input
                type="number"
                min="1"
                max="360"
                value={eta}
                onChange={(e) => setEta(Number(e.target.value))}
              />
            </label>
            <button
              className="pro-button"
              disabled={busy}
              onClick={() =>
                void action(
                  "job/transition",
                  {
                    job_id: job.id,
                    to: next[state.phase][0],
                    ...(state.phase === "accepted" ? { eta_minutes: eta } : {}),
                  },
                  "Job stage updated and notification queued.",
                )
              }
            >
              {next[state.phase][1]} ↗
            </button>
            {state.phase === "en_route" && (
              <button
                type="button"
                className="pro-link"
                disabled={busy}
                onClick={() =>
                  void action(
                    "job/eta",
                    { job_id: job.id, eta_minutes: eta },
                    "ETA updated for the customer.",
                  )
                }
              >
                Update ETA
              </button>
            )}
          </div>
        )}
        {data.permissions.includes("jobs.assign") && (
          <label>
            Assign a professional
            <select
              value={state.assigned_user_id || ""}
              onChange={(e) =>
                void action(
                  "job/assign",
                  { job_id: job.id, user_id: e.target.value },
                  "Professional assigned.",
                )
              }
            >
              <option value="" disabled>
                Choose a team member
              </option>
              {data.members
                .filter(
                  (m) =>
                    m.active &&
                    permissionsFor(m.role, m.permissions).includes("jobs.work"),
                )
                .map((m) => (
                  <option key={m.id} value={m.user_id}>
                    {m.name} · {m.role}
                  </option>
                ))}
            </select>
          </label>
        )}
        <h3>Customer reference photos</h3>
        <div className="pro-photo-grid">
          {detail.customerPhotos.map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              <img src={url} alt="Customer reference for this booking" />
            </a>
          ))}
        </div>
        {!detail.customerPhotos.length && (
          <p className="pro-hint">
            No customer attachment is available for this booking.
          </p>
        )}
        {sharing && state.latitude !== null && state.longitude !== null && (
          <iframe
            className="pro-map"
            title="Active job location on OpenStreetMap"
            loading="lazy"
            src={
              "https://www.openstreetmap.org/export/embed.html?bbox=" +
              encodeURIComponent(
                [
                  Number(state.longitude) - 0.02,
                  Number(state.latitude) - 0.015,
                  Number(state.longitude) + 0.02,
                  Number(state.latitude) + 0.015,
                ].join(","),
              ) +
              "&layer=mapnik&marker=" +
              encodeURIComponent(state.latitude + "," + state.longitude)
            }
          />
        )}
        <h3>Job evidence</h3>
        <p className="pro-hint">
          Ask permission. Photograph only the work area. Capture before, during
          and after images. Required stages protect an accurate completion
          record.
        </p>
        {canWork && !["completed", "cancelled"].includes(state.phase) && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fields = new FormData(e.currentTarget);
              fields.set("job_id", job.id);
              fields.set("phase", phase);
              fields.set("caption", caption);
              setUploading(true);
              try {
                const res = await fetch("/api/ops/upload", {
                  method: "POST",
                  body: fields,
                });
                const result = await res.json();
                if (!res.ok) throw Error(result.error);
                await refresh();
              } catch (e) {
                onError((e as Error).message);
              } finally {
                setUploading(false);
              }
            }}
          >
            <div className="pro-form-grid">
              <label>
                Stage
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                >
                  <option value="before">Before work</option>
                  <option value="during">During work</option>
                  <option value="after">After work</option>
                </select>
              </label>
              <label>
                Caption
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                />
              </label>
              <label>
                Job photo (up to 4 MB)
                <input
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  required
                />
              </label>
            </div>
            <button className="pro-button secondary" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload evidence"}
            </button>
          </form>
        )}
        <div className="pro-photo-grid">
          {detail.photos.map((p) => (
            <figure key={p.id}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                <img src={p.url} alt={p.caption || p.phase + " job evidence"} />
              </a>
              <figcaption>
                {p.phase} · {date(p.created_at)}
                <br />
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <h3>Job timeline</h3>
        <ol className="pro-timeline">
          {detail.events.map((e) => (
            <li key={e.id}>
              <strong>{e.event.replaceAll("_", " ")}</strong>
              <span>{date(e.created_at)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
