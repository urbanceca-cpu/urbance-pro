import Link from "next/link";
import { PublicShell } from "./PublicShell";
import { Icon } from "./Brand";
import { EarningsPreview } from "./EarningsPreview";
const services = [
  [
    "cleaning",
    "Home cleaning",
    "A fresh start, room to room.",
    "Standard, deep & move-out",
  ],
  [
    "craft",
    "Handyman & repairs",
    "Your eye for the little details.",
    "Assembly, mounting & maintenance",
  ],
  [
    "moving",
    "Moving & hauling",
    "Good people. A smoother move.",
    "Moving help & junk removal",
  ],
];
export default function ProviderHome() {
  return (
    <PublicShell>
      <section className="pro-studio-hero">
        <img
          className="pro-studio-hero-image"
          src="/images/pro/hero-team.webp"
          alt="Two home service professionals beside their organised work van in Vancouver"
          width="1440"
          height="960"
          fetchPriority="high"
        />
        <div className="pro-studio-hero-shade" />
        <div className="pro-studio-hero-copy">
          <span className="pro-kicker">
            <i /> FOR THE PEOPLE WHO DO GREAT WORK
          </span>
          <h1>
            Your craft.
            <br />
            Your people.
            <br />
            <em>More possibility.</em>
          </h1>
          <p>
            Build your next chapter with Urbance. Local home-service requests, a
            connected team, and a calmer way to run your working day.
          </p>
          <div className="pro-actions">
            <Link className="pro-button" href="/apply">
              Become an Urbance pro <Icon name="external" />
            </Link>
            <Link className="pro-hero-text-link" href="/how-it-works">
              Get to know us <Icon name="arrow" />
            </Link>
          </div>
          <div className="pro-hero-assurance">
            <Icon name="shield" />
            <span>
              Application reviewed. Standards shared. Good work respected.
            </span>
          </div>
        </div>
        <div className="pro-photo-note">
          <span className="pro-dot" />
          <span>ROOTED IN METRO VANCOUVER</span>
        </div>
      </section>
      <div className="pro-proof-bar">
        <div>
          <strong>
            7<span>%</span>
          </strong>
          <p>
            Commission on completed
            <br />
            Urbance marketplace jobs
          </p>
        </div>
        <div>
          <Icon name="clock" />
          <p>
            Your availability.
            <br />
            <strong>Your choice of work.</strong>
          </p>
        </div>
        <div>
          <Icon name="team" />
          <p>
            Independent or together.
            <br />
            <strong>A place for your business.</strong>
          </p>
        </div>
        <Link href="/earnings">
          No signup or monthly fee <Icon name="external" />
        </Link>
      </div>
      <section className="pro-section pro-container" data-reveal>
        <div className="pro-section-heading pro-heading-row">
          <div>
            <span className="pro-kicker">
              GOOD AT WHAT YOU DO? YOU BELONG HERE.
            </span>
            <h2>
              More than a job board.
              <br />
              <em>A home for your business.</em>
            </h2>
          </div>
          <p>
            You bring the skill and care. We help keep requests, schedules,
            people and job details connected—from the first offer to the final
            photo.
          </p>
        </div>
        <div className="pro-service-stories">
          {services.map(([image, title, copy, sub], i) => (
            <Link className="pro-service-story" href="/services" key={image}>
              <div>
                <img
                  src={`/images/pro/${image}.webp`}
                  alt={title + " professional at work"}
                  width="600"
                  height="400"
                  loading="lazy"
                />
                <span className="pro-photo-arrow">
                  <Icon name="external" />
                </span>
                <span className="pro-story-index">0{i + 1} / YOUR CRAFT</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>{sub}</small>
            </Link>
          ))}
        </div>
        <div className="pro-section-foot">
          <p>
            Also welcoming qualified professionals in painting, landscaping,
            appliances and regulated trades.
          </p>
          <Link className="pro-link" href="/services">
            Explore all services <Icon name="external" />
          </Link>
        </div>
      </section>
      <section className="pro-work-story" data-reveal>
        <div className="pro-container pro-story-grid">
          <div className="pro-work-story-image">
            <img
              src="/images/pro/team.webp"
              alt="A team owner and colleagues reviewing their schedule"
              width="720"
              height="540"
              loading="lazy"
            />
            <div className="pro-photo-card">
              <Icon name="team" />
              <div>
                <strong>Your business. Your people.</strong>
                <span>Give the right access to the right teammates.</span>
              </div>
            </div>
          </div>
          <div>
            <span className="pro-kicker">LESS FRICTION. MORE FORWARD.</span>
            <h2>
              A better working day.
              <br />
              All in one place.
            </h2>
            <p>
              A practical workspace built for how home-service businesses
              actually work.
            </p>
            <div className="pro-detail-points">
              {[
                [
                  "jobs",
                  "Requests that make sense",
                  "Matched to your services and city. See the scope, schedule and estimated earnings before you accept.",
                ],
                [
                  "team",
                  "A team that stays connected",
                  "Choose individual or team mode. Invite dispatchers, technicians and billing staff with specific permissions.",
                ],
                [
                  "documents",
                  "Details you can come back to",
                  "Keep job timelines, customer reference photos and before/during/after evidence with the job.",
                ],
              ].map(([icon, h, p]) => (
                <div key={h}>
                  <Icon name={icon} />
                  <div>
                    <h3>{h}</h3>
                    <p>{p}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link className="pro-link" href="/how-it-works">
              Explore the way we work <Icon name="external" />
            </Link>
          </div>
        </div>
      </section>
      <section className="pro-section pro-container" data-reveal>
        <div className="pro-section-heading">
          <span className="pro-kicker">A CLEARER WAY FROM OFFER TO DONE</span>
          <h2>One job. Every detail.</h2>
          <p>
            Know the next step, and keep your customer informed along the way.
          </p>
        </div>
        <div className="pro-process-grid">
          {[
            [
              "01",
              "Find your fit",
              "Go online when you’re ready. Review available requests and accept the work you can deliver.",
              "jobs",
            ],
            [
              "02",
              "Make it your day",
              "Assign the right teammate, open directions and share a provider-entered arrival estimate.",
              "pin",
            ],
            [
              "03",
              "Leave a good record",
              "Record your arrival and work stages. Add job photos with the customer’s permission.",
              "check",
            ],
          ].map(([n, h, p, icon]) => (
            <article key={n}>
              <div className="pro-process-icon">
                <Icon name={icon} />
                <span>{n}</span>
              </div>
              <h3>{h}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pro-earnings-band" data-reveal>
        <div className="pro-container pro-two-col">
          <div>
            <span className="pro-kicker">YOUR WORK DESERVES CLARITY</span>
            <h2>
              Good work.
              <br />
              Clear numbers.
            </h2>
            <p>
              No signup fee. No monthly subscription. Urbance’s commission is 7%
              on completed marketplace jobs, with an estimated breakdown before
              you accept.
            </p>
            <Link className="pro-button secondary" href="/earnings">
              Understand your earnings <Icon name="external" />
            </Link>
          </div>
          <EarningsPreview />
        </div>
      </section>
      <section
        className="pro-section pro-container pro-trust-story"
        data-reveal
      >
        <div>
          <span className="pro-kicker">TRUST GOES BOTH WAYS</span>
          <h2>
            High standards.
            <br />A human approach.
          </h2>
          <p>
            Customers are inviting you into their homes. You deserve to know
            what’s expected, how your information is handled, and where to find
            support.
          </p>
          <div className="pro-trust-tags">
            <span>
              <Icon name="shield" />
              Private documents
            </span>
            <span>
              <Icon name="check" />
              Reviewed credentials
            </span>
            <span>
              <Icon name="support" />A team to contact
            </span>
          </div>
          <Link className="pro-link" href="/requirements">
            Read our provider standards <Icon name="external" />
          </Link>
        </div>
        <img
          src="/images/pro/craft.webp"
          alt="A professional carefully checking the level of a wooden shelf"
          width="700"
          height="520"
          loading="lazy"
        />
      </section>
      <section className="pro-neighbourhood" data-reveal>
        <img
          src="/images/pro/vancouver.webp"
          alt="Tree-lined Metro Vancouver homes with mountains in the distance"
          width="1440"
          height="960"
          loading="lazy"
        />
        <div className="pro-container">
          <span className="pro-kicker">LOCAL WORK. FAMILIAR STREETS.</span>
          <h2>
            Rooted here.
            <br />
            Ready for what’s next.
          </h2>
          <p>
            From Vancouver and Burnaby to Surrey, Richmond and the Tri-Cities.
            Set your home city and travel radius, and see opportunities that
            fit.
          </p>
          <Link className="pro-button" href="/apply">
            Find your next chapter <Icon name="external" />
          </Link>
          <small>
            Service coverage and job availability vary by category and city.
          </small>
        </div>
      </section>
      <section
        className="pro-section pro-container pro-home-questions"
        data-reveal
      >
        <div>
          <span className="pro-kicker">BEFORE YOU JOIN</span>
          <h2>
            A few things
            <br />
            you might be wondering.
          </h2>
          <Link className="pro-link" href="/faq">
            More good questions <Icon name="external" />
          </Link>
        </div>
        <div>
          {[
            [
              "Can I join as an individual?",
              "Yes. Apply as an individual contractor or a team business. You can change your business mode later in Settings, subject to active team membership.",
            ],
            [
              "When can I start accepting jobs?",
              "After completing your application, verifying your email, submitting the required documents and agreements, and receiving approval.",
            ],
            [
              "What happens when I’m offline?",
              "Availability and recent activity help determine which providers receive offers. Nearby cities may be included when local providers are unavailable or a request remains unclaimed.",
            ],
            [
              "Do I have to accept every request?",
              "No. Review the details and accept only the work you can deliver. Approval does not guarantee a particular job volume or income.",
            ],
          ].map(([q, a]) => (
            <details className="pro-faq" key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="pro-container pro-studio-last" data-reveal>
        <span className="pro-kicker">BRING YOUR CRAFT. WE’LL MAKE ROOM.</span>
        <h2>
          Make your next
          <br />
          working day a better one.
        </h2>
        <div className="pro-actions">
          <Link className="pro-button" href="/apply">
            Start your application <Icon name="external" />
          </Link>
          <a href="mailto:support@urbance.ca">Or talk to our team ↗</a>
        </div>
        <p>Save your progress. Come back when you’re ready.</p>
      </section>
    </PublicShell>
  );
}
