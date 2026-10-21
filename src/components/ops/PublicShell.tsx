import Link from "next/link";
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pro-public">
      <a className="pro-skip" href="#content">
        Skip to content
      </a>
      <header className="pro-nav">
        <Link className="pro-wordmark" href="/">
          urbance<span>for professionals</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/requirements">Standards</Link>
          <Link href="/earnings">Earnings</Link>
        </nav>
        <div>
          <Link href="/login">Sign in</Link>
          <Link className="pro-button" href="/apply">
            Become a pro <span>↗</span>
          </Link>
        </div>
      </header>
      <main id="content">{children}</main>
      <footer className="pro-footer">
        <div>
          <Link className="pro-wordmark" href="/">
            urbance<span>Good work starts here.</span>
          </Link>
          <p>
            Urbance Technologies Inc.
            <br />
            Metro Vancouver, British Columbia
          </p>
        </div>
        <div>
          <Link href="/terms">Provider terms</Link>
          <Link href="/contractor-agreement">Contractor agreement</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/safety">Safety & documentation</Link>
        </div>
        <div>
          <Link href="/faq">Common questions</Link>
          <a href="mailto:support@urbance.ca">support@urbance.ca</a>
          <a href="https://www.urbance.ca">Customer website ↗</a>
        </div>
        <small>
          © {new Date().getFullYear()} Urbance Technologies Inc. · Prices in CAD
        </small>
      </footer>
    </div>
  );
}
export function Hero({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
}) {
  return (
    <div className="pro-page-hero">
      <span className="pro-kicker">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </div>
  );
}
