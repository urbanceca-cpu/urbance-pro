import Link from "next/link";
import { Brand, Icon } from "./Brand";
import { Reveal } from "./Reveal";
const menu = (
  <>
    <Link href="/how-it-works">How it works</Link>
    <Link href="/services">Services</Link>
    <Link href="/requirements">Our standards</Link>
    <Link href="/earnings">Earnings</Link>
    <Link href="/faq">Questions</Link>
  </>
);
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pro-public pro-studio">
      <a className="pro-skip" href="#content">
        Skip to content
      </a>
      <div className="pro-utility">
        <span>LOCAL EXPERTISE. MORE POSSIBILITY.</span>
        <a href="https://www.urbance.ca">
          Looking for a home service? <strong>Visit Urbance</strong>{" "}
          <Icon name="external" />
        </a>
      </div>
      <header className="pro-nav">
        <Link
          className="pro-wordmark"
          href="/"
          aria-label="Urbance for professionals home"
        >
          <Brand light />
        </Link>
        <nav aria-label="Main navigation">{menu}</nav>
        <div className="pro-nav-actions">
          <Link href="/login">Sign in</Link>
          <Link className="pro-button" href="/apply">
            Join Urbance <Icon name="external" />
          </Link>
          <details className="pro-mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {menu}
              <Link href="/login">Provider sign in</Link>
              <a href="https://www.urbance.ca">Customer website ↗</a>
            </nav>
          </details>
        </div>
      </header>
      <main id="content">{children}</main>
      <section className="pro-world-link pro-container">
        <div>
          <span className="pro-kicker">
            ONE URBANCE. BOTH SIDES OF THE DOOR.
          </span>
          <h2>
            Good work starts
            <br />
            with a home that needs it.
          </h2>
          <p>
            Explore the customer experience: services, itemized quotes, service
            areas and support. See the bigger picture behind every request.
          </p>
          <a className="pro-button secondary" href="https://www.urbance.ca">
            Explore Urbance for your home <Icon name="external" />
          </a>
        </div>
        <div className="pro-world-links">
          <a href="https://www.urbance.ca/services.html">
            Explore home services <Icon name="arrow" />
          </a>
          <a href="https://www.urbance.ca/pricing.html">
            Understand customer pricing <Icon name="arrow" />
          </a>
          <a href="https://www.urbance.ca/areas.html">
            See our neighbourhoods <Icon name="arrow" />
          </a>
          <a href="https://www.urbance.ca/contact.html">
            Talk to the Urbance team <Icon name="arrow" />
          </a>
        </div>
      </section>
      <footer className="pro-footer">
        <div>
          <Link className="pro-wordmark" href="/" aria-label="Urbance home">
            <Brand light subtitle="GOOD WORK. ALL TOGETHER." />
          </Link>
          <p>
            A little less admin.
            <br />A lot more room for your craft.
          </p>
          <span>Metro Vancouver, British Columbia</span>
        </div>
        <div>
          <h3>FOR YOUR BUSINESS</h3>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/services">Your services</Link>
          <Link href="/earnings">Earnings & commission</Link>
          <Link href="/requirements">Application requirements</Link>
          <Link href="/login">Your workspace</Link>
        </div>
        <div>
          <h3>TRUST & SUPPORT</h3>
          <Link href="/terms">Provider terms</Link>
          <Link href="/contractor-agreement">Contractor agreement</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/safety">Safety & documentation</Link>
          <Link href="/faq">Common questions</Link>
        </div>
        <div>
          <h3>PART OF URBANCE</h3>
          <a href="https://www.urbance.ca">Customer website ↗</a>
          <a href="https://www.urbance.ca/about.html">About Urbance</a>
          <a href="https://www.urbance.ca/guides.html">Home guides</a>
          <a href="mailto:support@urbance.ca">support@urbance.ca</a>
        </div>
        <small>
          © {new Date().getFullYear()} Urbance Technologies Inc. · British
          Columbia, Canada · Prices in CAD
        </small>
      </footer>
      <Reveal />
    </div>
  );
}
export function Hero({
  eyebrow,
  title,
  copy,
  image = "team",
  alt = "Home service professionals planning their day",
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  image?: string;
  alt?: string;
}) {
  return (
    <section className="pro-page-hero">
      <div>
        <Link className="pro-breadcrumb" href="/">
          For professionals <span> / </span> Learn more
        </Link>
        <span className="pro-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
        <div className="pro-actions">
          <Link className="pro-button" href="/apply">
            Start your application <Icon name="external" />
          </Link>
          <a className="pro-hero-text-link" href="https://www.urbance.ca">
            Visit customer website ↗
          </a>
        </div>
      </div>
      <img
        src={`/images/pro/${image}.webp`}
        width="720"
        height="540"
        alt={alt}
        fetchPriority="high"
      />
    </section>
  );
}
