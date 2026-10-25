"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthForm, { api, ApiError } from "./AuthForm";
import { PublicShell, Hero } from "./PublicShell";
import { CATEGORIES, CITIES, POLICY_VERSION } from "@/lib/ops/domain";
import { createClient } from "@/lib/supabase/client";
type Values = {
  legal_name: string;
  business_name: string;
  business_type: "individual" | "team";
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  categories: string[];
  worksafe_status: "registered" | "not_required_review";
  worksafe_number: string;
  insurance_limit: number;
  insurance_expiry: string;
  licence_number: string;
  years_experience: number;
  authorized_to_work: boolean;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  contractor_accepted: boolean;
  safety_accepted: boolean;
  accuracy_accepted: boolean;
  marketing_consent: boolean;
  notes: string;
};
const empty: Values = {
  legal_name: "",
  business_name: "",
  business_type: "individual",
  phone: "",
  address: "",
  city: "Vancouver",
  postal_code: "",
  categories: [],
  worksafe_status: "registered",
  worksafe_number: "",
  insurance_limit: 2000000,
  insurance_expiry: "",
  licence_number: "",
  years_experience: 0,
  authorized_to_work: false,
  terms_accepted: false,
  privacy_accepted: false,
  contractor_accepted: false,
  safety_accepted: false,
  accuracy_accepted: false,
  marketing_consent: false,
  notes: "",
};
type Doc = {
  id: string;
  kind: string;
  original_name: string;
  expires_at: string | null;
};
type ApplicationReply = {
  application: { status: string; basic_info: Partial<Values> } | null;
  documents: Doc[];
  email: string;
  verified: boolean;
};
const steps = [
  "Your business",
  "Services & standards",
  "Documents",
  "Agreements",
  "Review & submit",
];
export default function Application() {
  const [data, setData] = useState<Values>(empty),
    [docs, setDocs] = useState<Doc[]>([]),
    [step, setStep] = useState(0),
    [loading, setLoading] = useState(true),
    [signed, setSigned] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [status, setStatus] = useState("draft");
  const [loadError, setLoadError] = useState("");
  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const result = await api<ApplicationReply>("application");
      setSigned(true);
      setData({ ...empty, ...result.application?.basic_info });
      setDocs(result.documents);
      setStatus(result.application?.status || "draft");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setSigned(false);
      else setLoadError("We couldn’t load your saved application. Please retry. Your progress has not been changed.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let live = true;
    api<ApplicationReply>("application")
      .then((result) => {
        if (!live) return;
        setSigned(true);
        setData({ ...empty, ...result.application?.basic_info });
        setDocs(result.documents);
        setStatus(result.application?.status || "draft");
      })
      .catch((e) => {
        if (!live) return;
        if (e instanceof ApiError && e.status === 401) setSigned(false);
        else setLoadError("We couldn’t load your saved application. Please retry. Your progress has not been changed.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  function change<K extends keyof Values>(key: K, value: Values[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  async function save(submit = false) {
    setBusy(true);
    setError("");
    try {
      await api("application", { data, submit });
      setNotice(
        submit
          ? "Application submitted. Your verification review is next."
          : "Progress saved securely.",
      );
      if (submit) setStatus("submitted");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function next() {
    const form = document.getElementById("application-step") as HTMLFormElement;
    if (!form.reportValidity()) return;
    if (await save()) setStep((s) => Math.min(4, s + 1));
  }
  async function upload(kind: string, file: File, expiry: string) {
    setBusy(true);
    setError("");
    const form = new FormData();
    form.set("file", file);
    form.set("kind", kind);
    if (expiry) form.set("expires_at", expiry);
    try {
      const response = await fetch("/api/ops/upload", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      const refreshed = await api<ApplicationReply>("application");
      setDocs(refreshed.documents);
      setNotice("Document uploaded securely.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Upload failed. Retry your file.",
      );
    } finally {
      setBusy(false);
    }
  }
  const field = (
    key: keyof Values,
    label: string,
    type = "text",
    required = true,
  ) => (
    <label key={key}>
      {label}
      <input
        type={type}
        value={String(data[key])}
        required={required}
        onChange={(e) =>
          change(
            key,
            (type === "number"
              ? Number(e.target.value)
              : e.target.value) as never,
          )
        }
        maxLength={type === "text" ? 250 : undefined}
        min={type === "number" ? 0 : undefined}
      />
    </label>
  );
  return (
    <PublicShell>
      <div className="pro-container pro-application">
        <Hero eyebrow="YOUR NEXT CHAPTER STARTS HERE" title="A little about your business." copy="Complete your profile, share your credentials and review the agreements. We’ll review the details before enabling job access." image="cleaning" alt="A professional caring for a kitchen in a Vancouver home" />
        {loading ? (
          <div className="pro-card" role="status">
            Loading your secure application…
          </div>
        ) : loadError ? (
          <div className="pro-card" role="alert">
            <p>{loadError}</p>
            <button type="button" className="pro-button" onClick={() => void load()}>Try again</button>
          </div>
        ) : !signed ? (
          <div className="pro-auth-layout">
            <aside>
              <h2>
                One application.
                <br />A professional start.
              </h2>
              <p>
                Have your ID, current insurance, background-check documentation
                and applicable licences ready. Documents stay private.
              </p>
              <p>
                Do not upload your SIN, bank credentials or immigration
                documents.
              </p>
            </aside>
            <AuthForm mode="signup" onSuccess={() => void load()} />
          </div>
        ) : status !== "draft" && status !== "rejected" ? (
          <div className="pro-card pro-review">
            <span className="pro-status">{status.replaceAll("_", " ")}</span>
            <h2>Your application is with us.</h2>
            <p>
              Your application is complete. Our team reviews your credentials
              before job access is enabled. Contact support@urbance.ca to
              correct a submitted detail.
            </p>
            <Link
              className="pro-button"
              href={
                status === "approved" ? "/dashboard" : "/application-status"
              }
            >
              {status === "approved"
                ? "Open workspace"
                : "View application status"}{" "}
              ↗
            </Link>
          </div>
        ) : (
          <div className="pro-application-grid">
            <aside className="pro-application-steps">
              <span className="pro-kicker">YOUR APPLICATION</span>
              {steps.map((title, index) => (
                <button
                  type="button"
                  key={title}
                  onClick={() => index <= step && setStep(index)}
                  aria-current={step === index ? "step" : undefined}
                  disabled={busy || index > step}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </button>
              ))}
              <p>
                Progress is saved to your account. Incomplete applications
                cannot access the provider workspace.
              </p>
              <button
                type="button"
                className="pro-link"
                onClick={async () => {
                  await createClient().auth.signOut();
                  location.assign("/");
                }}
              >
                Sign out
              </button>
            </aside>
            <div className="pro-card pro-application-body">
              <span className="pro-kicker">STEP {step + 1} OF 5</span>
              <h2>{steps[step]}</h2>
              {notice && (
                <p className="pro-notice" role="status">
                  {notice}
                </p>
              )}
              {error && (
                <p className="pro-error" role="alert">
                  {error}
                </p>
              )}
              <form
                id="application-step"
                onSubmit={(e) => {
                  e.preventDefault();
                  void next();
                }}
              >
                {step === 0 && (
                  <>
                    <div className="pro-mode-grid">
                      {(["individual", "team"] as const).map((mode) => (
                        <button
                          type="button"
                          key={mode}
                          aria-pressed={data.business_type === mode}
                          onClick={() => change("business_type", mode)}
                        >
                          <strong>
                            {mode === "individual"
                              ? "Independent professional"
                              : "Business with a team"}
                          </strong>
                          <span>
                            {mode === "individual"
                              ? "Work under your own account."
                              : "Invite people and set their permissions."}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="pro-hint">
                      You can change this later in Settings.
                    </p>
                    <div className="pro-form-grid">
                      {field("legal_name", "Full legal name")}
                      {field(
                        "business_name",
                        "Business/trading name (if applicable)",
                        "text",
                        false,
                      )}
                      {field("phone", "Canadian phone number", "tel")}
                      {field("address", "Business mailing address")}
                      <label>
                        Home city
                        <select
                          value={data.city}
                          onChange={(e) => change("city", e.target.value)}
                        >
                          {Object.keys(CITIES).map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      {field("postal_code", "Canadian postal code")}
                    </div>
                    <label className="pro-checkbox">
                      <input
                        type="checkbox"
                        checked={data.authorized_to_work}
                        required
                        onChange={(e) =>
                          change("authorized_to_work", e.target.checked)
                        }
                      />
                      I confirm that I and anyone I assign are legally entitled
                      to perform this work in Canada. I will provide appropriate
                      evidence through a secure review process if required.
                    </label>
                  </>
                )}
                {step === 1 && (
                  <>
                    <p>
                      Choose work you are qualified and insured to perform.
                      Regulated work requires the relevant authorization.
                    </p>
                    <div className="pro-choice-grid">
                      {CATEGORIES.map((c) => (
                        <label key={c} className="pro-checkbox">
                          <input
                            type="checkbox"
                            checked={data.categories.includes(c)}
                            onChange={(e) =>
                              change(
                                "categories",
                                e.target.checked
                                  ? [...data.categories, c]
                                  : data.categories.filter((x) => x !== c),
                              )
                            }
                          />
                          {c === "junk" ? "Junk removal" : c}
                        </label>
                      ))}
                    </div>
                    <div className="pro-form-grid">
                      {field(
                        "years_experience",
                        "Years of relevant experience",
                        "number",
                      )}
                      <label>
                        WorkSafeBC status
                        <select
                          value={data.worksafe_status}
                          onChange={(e) =>
                            change(
                              "worksafe_status",
                              e.target.value as Values["worksafe_status"],
                            )
                          }
                        >
                          <option value="registered">
                            Registered — I will provide clearance
                          </option>
                          <option value="not_required_review">
                            I believe registration is not required — request
                            review
                          </option>
                        </select>
                      </label>
                      {field(
                        "worksafe_number",
                        "WorkSafeBC account number (if registered)",
                        "text",
                        data.worksafe_status === "registered",
                      )}
                      {field(
                        "insurance_limit",
                        "Liability coverage amount (CAD)",
                        "number",
                      )}
                      {field(
                        "insurance_expiry",
                        "Insurance expiry date",
                        "date",
                      )}
                      {field(
                        "licence_number",
                        "Trade licence / certification number",
                        "text",
                        data.categories.some((c) =>
                          ["electrical", "plumbing"].includes(c),
                        ),
                      )}
                    </div>
                    <label>
                      Experience, licence scope or WorkSafeBC explanation
                      <textarea
                        value={data.notes}
                        onChange={(e) => change("notes", e.target.value)}
                        maxLength={1500}
                        required={
                          data.worksafe_status === "not_required_review"
                        }
                      />
                    </label>
                    <p className="pro-hint">
                      CAD $2M liability coverage and background-check
                      documentation are Urbance requirements. WorkSafeBC,
                      licences and permits depend on the work and your
                      circumstances.
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <p>
                      Upload readable originals. PDF, JPEG, PNG or WebP, up to 4
                      MB each. Documents are private and reviewed by authorized
                      staff.
                    </p>
                    <div className="pro-doc-list">
                      {[
                        [
                          "government_id",
                          "Government photo ID",
                          "Required · show your identity, not a SIN card",
                        ],
                        [
                          "liability_insurance",
                          "Liability insurance certificate",
                          "Required · minimum CAD $2M, current coverage",
                        ],
                        [
                          "background_check",
                          "Background-check documentation",
                          "Required · company verification standard",
                        ],
                        [
                          "worksafe_clearance",
                          "WorkSafeBC clearance letter",
                          data.worksafe_status === "registered"
                            ? "Required for your declared status"
                            : "If applicable after review",
                        ],
                        [
                          "trade_licence",
                          "Trade licences / qualifications",
                          "Required for regulated services",
                        ],
                        [
                          "business_licence",
                          "Business licence",
                          "Where required for your business/city",
                        ],
                      ].map(([kind, title, description]) => (
                        <UploadCard
                          key={kind}
                          title={title}
                          description={description}
                          docs={docs.filter((d) => d.kind === kind)}
                          disabled={busy}
                          onUpload={(file, expiry) =>
                            void upload(kind, file, expiry)
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <p>
                      Read each policy before accepting. We record your
                      acceptance of version {POLICY_VERSION} with a server
                      timestamp.
                    </p>
                    {(
                      [
                        ["terms_accepted", "terms", "Provider terms"],
                        [
                          "privacy_accepted",
                          "privacy",
                          "Privacy policy and necessary data processing",
                        ],
                        [
                          "contractor_accepted",
                          "contractor-agreement",
                          "Independent contractor agreement",
                        ],
                        [
                          "safety_accepted",
                          "safety",
                          "Safety and documentation standards",
                        ],
                      ] as const
                    ).map(([key, path, title]) => (
                      <div className="pro-agreement" key={key}>
                        <Link href={"/" + path} target="_blank" rel="noopener">
                          Read {title.toLowerCase()} ↗
                        </Link>
                        <label className="pro-checkbox">
                          <input
                            type="checkbox"
                            checked={data[key]}
                            required
                            onChange={(e) => change(key, e.target.checked)}
                          />
                          I have read and accept the {title.toLowerCase()}.
                        </label>
                      </div>
                    ))}
                    <label className="pro-checkbox">
                      <input
                        type="checkbox"
                        checked={data.accuracy_accepted}
                        required
                        onChange={(e) =>
                          change("accuracy_accepted", e.target.checked)
                        }
                      />
                      I am authorized to bind this business. The information and
                      documents are accurate, and I will report changes or
                      expiry.
                    </label>
                    <label className="pro-checkbox">
                      <input
                        type="checkbox"
                        checked={data.marketing_consent}
                        onChange={(e) =>
                          change("marketing_consent", e.target.checked)
                        }
                      />
                      Optional: email me Urbance news and promotions. I can
                      unsubscribe at any time. Operational account and job
                      messages are managed separately.
                    </label>
                  </>
                )}
                {step === 4 && (
                  <>
                    <p>
                      Check your details. Submission completes your application;
                      approval is required before receiving or working jobs.
                    </p>
                    <dl className="pro-detail-list">
                      <div>
                        <dt>Applicant</dt>
                        <dd>{data.legal_name}</dd>
                      </div>
                      <div>
                        <dt>Business</dt>
                        <dd>
                          {data.business_name || data.legal_name} ·{" "}
                          {data.business_type}
                        </dd>
                      </div>
                      <div>
                        <dt>Coverage</dt>
                        <dd>
                          {data.city} · {data.categories.join(", ")}
                        </dd>
                      </div>
                      <div>
                        <dt>Insurance</dt>
                        <dd>
                          CAD ${data.insurance_limit.toLocaleString()} · expires{" "}
                          {data.insurance_expiry}
                        </dd>
                      </div>
                      <div>
                        <dt>Documents</dt>
                        <dd>{docs.length} private uploads</dd>
                      </div>
                      <div>
                        <dt>Agreements</dt>
                        <dd>Version {POLICY_VERSION}</dd>
                      </div>
                    </dl>
                    <p className="pro-notice">
                      No signup or monthly fee. Urbance commission is 7% on
                      completed marketplace jobs. Approval and job volume are
                      not guaranteed.
                    </p>
                  </>
                )}
                <div className="pro-form-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="pro-button secondary"
                      disabled={busy}
                      onClick={() => setStep((s) => s - 1)}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    className="pro-link"
                    disabled={busy}
                    onClick={() => void save()}
                  >
                    Save progress
                  </button>
                  {step < 4 ? (
                    <button className="pro-button" disabled={busy}>
                      Continue ↗
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="pro-button"
                      disabled={busy}
                      onClick={() => void save(true)}
                    >
                      {busy ? "Submitting…" : "Submit for review ↗"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
function UploadCard({
  title,
  description,
  docs,
  disabled,
  onUpload,
}: {
  title: string;
  description: string;
  docs: Doc[];
  disabled: boolean;
  onUpload: (f: File, e: string) => void;
}) {
  const [expiry, setExpiry] = useState("");
  return (
    <div className="pro-upload-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {docs.map((d) => (
          <span className="pro-file-chip" key={d.id}>
            ✓ {d.original_name}
            {d.expires_at ? " · " + d.expires_at : ""}
          </span>
        ))}
      </div>
      <label>
        Expiry (if applicable)
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </label>
      <label className="pro-upload-label">
        {disabled ? "Uploading…" : "Choose document"}
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file, expiry);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
