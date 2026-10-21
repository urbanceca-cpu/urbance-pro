import Link from "next/link";
import { PublicShell } from "./PublicShell";
export default function ProviderHome() {
  return (
    <PublicShell>
      <section className="pro-home-hero pro-container">
        <div>
          <span className="pro-kicker">
            <i /> BUILT FOR THE PEOPLE WHO DO THE WORK
          </span>
          <h1>
            Your craft.
            <br />
            Your team.
            <br />
            <em>A clearer day.</em>
          </h1>
          <p>
            Good jobs. Clear details. One workspace for your home service
            business in Metro Vancouver.
          </p>
          <div className="pro-actions">
            <Link className="pro-button" href="/apply">
              Apply to join Urbance <span>↗</span>
            </Link>
            <Link href="/how-it-works">See how it works ↓</Link>
          </div>
          <small>
            No signup fee. No monthly fee. 7% commission on completed Urbance
            jobs.
          </small>
        </div>
        <div className="pro-hero-scene">
          <img
            src="https://www.urbance.ca/assets/images/service-handyman-editorial-v3.webp"
            alt="A professional carefully securing a shelf in a bright home"
            width="640"
            height="760"
            fetchPriority="high"
          />
          <div className="pro-hero-caption">
            <span className="pro-dot" />
            <div>
              <small>YOUR NEXT CHAPTER</small>
              <strong>Built around good work.</strong>
              <p>A workspace that keeps the details together.</p>
            </div>
          </div>
          <span className="pro-scene-tag">
            Independent or together. You’re in control.
          </span>
        </div>
      </section>
      <div className="pro-value-strip pro-container">
        <span>
          01 <strong>Clear scope before acceptance</strong>
        </span>
        <span>
          02 <strong>Choose your availability</strong>
        </span>
        <span>
          03 <strong>Your team. Your permissions.</strong>
        </span>
      </div>
      <section className="pro-section pro-container">
        <div className="pro-section-heading">
          <span className="pro-kicker">LESS ADMIN. MORE CRAFT.</span>
          <h2>
            A working day,
            <br />
            thoughtfully connected.
          </h2>
          <p>
            From the first job offer to the last photo, the next step stays
            clear.
          </p>
        </div>
        <div className="pro-feature-grid">
          {[
            [
              "01",
              "Find your next job",
              "See requests matched to your services and city. Review the scope and payout, then accept the work you can deliver.",
            ],
            [
              "02",
              "Bring your people",
              "Work independently or invite your team. Set roles for dispatch, job work, billing and visibility.",
            ],
            [
              "03",
              "Keep a clear record",
              "Record arrival and start times. Capture before, during and after photos. Keep your customer informed.",
            ],
            [
              "04",
              "Keep business moving",
              "Review your earnings, prepare provider-issued invoices and manage the documents that support your business.",
            ],
          ].map(([n, title, p]) => (
            <article key={n} className="pro-card">
              <span className="pro-step">{n}</span>
              <h3>{title}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pro-section pro-soft">
        <div className="pro-container pro-two-col">
          <div>
            <span className="pro-kicker">TRUST STARTS BEFORE THE JOB</span>
            <h2>
              A professional network.
              <br />
              With clear standards.
            </h2>
            <p>
              Tell us about your experience, coverage and credentials. Submit
              your documents and agreements for review. Job access begins after
              approval.
            </p>
            <Link className="pro-link" href="/requirements">
              Read the requirements ↗
            </Link>
          </div>
          <div className="pro-checklist">
            <p>Government ID and work eligibility declaration</p>
            <p>CAD $2M liability insurance</p>
            <p>WorkSafeBC and trade credentials where applicable</p>
            <p>Background-check documentation and safety commitments</p>
            <p>Private document access and recorded policy acceptance</p>
          </div>
        </div>
      </section>
      <section className="pro-section pro-container">
        <div className="pro-join">
          <span className="pro-kicker">MAKE ROOM FOR THE WORK YOU DO BEST</span>
          <h2>
            Good work.
            <br />A better way to manage it.
          </h2>
          <Link className="pro-button" href="/apply">
            Start your application ↗
          </Link>
          <p>Save your progress. Come back when you’re ready.</p>
        </div>
      </section>
    </PublicShell>
  );
}
