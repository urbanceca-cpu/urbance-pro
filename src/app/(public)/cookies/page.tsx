'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.04 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const TOC = [
  { id: 'introduction',   label: 'Introduction' },
  { id: 'what-are',       label: 'What Are Cookies?' },
  { id: 'types',          label: 'Types of Cookies' },
  { id: 'third-party',    label: 'Third-Party Cookies' },
  { id: 'controls',       label: 'Managing Cookies' },
  { id: 'retention',      label: 'Data Retention' },
  { id: 'legal-basis',    label: 'Legal Basis' },
  { id: 'updates',        label: 'Policy Updates' },
  { id: 'contact',        label: 'Contact Us' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 14px', fontFamily: FONT }}>{children}</p>;
}
function SH({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: '0 0 18px', letterSpacing: '-0.025em', lineHeight: 1.3, fontFamily: FONT }}>{children}</h2>;
}
function SubH({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 10px', letterSpacing: '-0.01em', fontFamily: FONT }}>{children}</h3>;
}
function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 14px', fontFamily: FONT }}>{children}</p>;
}
function B({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #F3F4F6', listStyle: 'none' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2F80ED', flexShrink: 0, marginTop: '8px' }} />
      <span style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, fontFamily: FONT }}>{children}</span>
    </li>
  );
}
function Callout({ children, color = '#EBF3FD', border = '#2F80ED', text = '#1E40AF' }: { children: React.ReactNode; color?: string; border?: string; text?: string }) {
  return (
    <div style={{ background: color, borderRadius: '12px', padding: '16px 20px', marginBottom: '22px', borderLeft: `3px solid ${border}` }}>
      <p style={{ margin: 0, fontSize: '14.5px', color: text, fontWeight: 600, lineHeight: 1.65, fontFamily: FONT }}>{children}</p>
    </div>
  );
}
function Divider() {
  return <div style={{ height: '1px', background: '#F3F4F6', margin: '48px 0' }} />;
}

const fadeStyle: React.CSSProperties = { opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' };

export default function CookiesPage() {
  const heroRef = useFadeIn();
  const tocRef  = useFadeIn();
  const s1 = useFadeIn(); const s2 = useFadeIn(); const s3 = useFadeIn();
  const s4 = useFadeIn(); const s5 = useFadeIn(); const s6 = useFadeIn();
  const s7 = useFadeIn(); const s8 = useFadeIn(); const s9 = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{ fontFamily: FONT, color: '#111', background: '#fff' }}>

        {/* ─── HERO ─── */}
        <section style={{ padding: '140px 24px 80px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
          <div ref={heroRef} style={{ ...fadeStyle, maxWidth: '760px', margin: '0 auto' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 20px' }}>Legal</p>
            <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#111', margin: '0 0 18px', lineHeight: 1.06 }}>
              Provider Cookie Policy
            </h1>
            <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.75, maxWidth: '600px', margin: '0 0 28px' }}>
              This policy explains how cookies and similar tracking technologies are used on <strong>pros.urbance.ca</strong> — the platform for registered service professionals. Please read this alongside our <Link href="/privacy" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F7FA', borderRadius: '8px', padding: '8px 16px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Last updated: March 2, 2026</span>
            </div>
          </div>
        </section>

        {/* ─── TWO-COLUMN LAYOUT ─── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 96px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '64px', alignItems: 'start' }}>

          {/* ─── STICKY TOC ─── */}
          <aside ref={tocRef} style={{ ...fadeStyle, position: 'sticky', top: '100px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 16px' }}>Contents</p>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', fontSize: '13px', color: '#6B7280', textDecoration: 'none', borderBottom: i < TOC.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'color 0.15s', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2F80ED')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                    >
                      <span style={{ width: '20px', fontSize: '11.5px', color: '#D1D5DB', fontWeight: 600, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* ─── CONTENT ─── */}
          <div>

            {/* 01 · Introduction */}
            <section id="introduction">
              <div ref={s1} style={fadeStyle}>
                <SectionLabel>01 — Introduction</SectionLabel>
                <SH>About this Cookie Policy</SH>
                <Body>
                  Urbance Inc. (&ldquo;Urbance&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) uses cookies and similar technologies on <strong>pros.urbance.ca</strong> to keep the platform secure, functional, and performant for registered service providers.
                </Body>
                <Body>
                  This Cookie Policy explains what cookies are, which ones we use, and how you can manage them. It applies specifically to the Urbance Providers portal and should be read alongside our <Link href="/privacy" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</Link>.
                </Body>
                <Callout>
                  We do not use cookies for advertising, cross-site tracking, or the sale of personal data. All cookies on this platform serve a functional, security, or analytical purpose directly related to your use of the service.
                </Callout>
              </div>
            </section>

            <Divider />

            {/* 02 · What Are Cookies */}
            <section id="what-are">
              <div ref={s2} style={fadeStyle}>
                <SectionLabel>02 — What Are Cookies?</SectionLabel>
                <SH>A simple explanation</SH>
                <Body>
                  Cookies are small text files placed on your device (computer, phone, or tablet) when you visit a website. They allow the site to remember information about your visit — such as whether you are logged in — and help the platform work correctly on your next visit.
                </Body>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  {[
                    {
                      icon: '⏱️',
                      title: 'Session Cookies',
                      desc: 'Temporary cookies that exist only while your browser is open. They are deleted automatically when you close your tab or sign out. Used primarily for authentication and security.',
                    },
                    {
                      icon: '💾',
                      title: 'Persistent Cookies',
                      desc: 'Cookies that remain on your device for a set period after your session ends. Used to remember preferences and maintain logged-in state across visits.',
                    },
                  ].map(c => (
                    <div key={c.title} style={{ background: '#F5F7FA', borderRadius: '14px', padding: '20px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '22px', marginBottom: '10px' }}>{c.icon}</div>
                      <SubH>{c.title}</SubH>
                      <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: 1.7, margin: 0, fontFamily: FONT }}>{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Body>
                  In addition to traditional cookies, we may use <strong style={{ color: '#374151' }}>similar technologies</strong> such as browser local storage (for saving UI preferences), session tokens (for secure authentication), and analytics scripts. These function in a similar way and are covered by this policy.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 03 · Types of Cookies */}
            <section id="types">
              <div ref={s3} style={fadeStyle}>
                <SectionLabel>03 — Types of Cookies We Use</SectionLabel>
                <SH>What each cookie does</SH>

                {/* Essential */}
                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '14px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#DCFCE7', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, color: '#166534', fontFamily: FONT }}>Always Active</div>
                    <SubH>A — Essential Cookies</SubH>
                  </div>
                  <Body>These cookies are strictly necessary for the platform to function. They cannot be disabled without breaking core features.</Body>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Authentication tokens</strong> — Keep you signed in securely across page loads and browser sessions.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Session management</strong> — Track your active session and automatically expire it after inactivity.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Security (CSRF)</strong> — Protect form submissions from cross-site request forgery attacks.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Dashboard state</strong> — Maintain your current view and active tab within the provider dashboard.</B>
                  </ul>
                </div>

                {/* Performance */}
                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '14px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#EBF3FD', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, color: '#1E40AF', fontFamily: FONT }}>Analytics</div>
                    <SubH>B — Performance &amp; Analytics Cookies</SubH>
                  </div>
                  <Body>These cookies collect anonymised data about how the platform is used to help us improve performance and identify issues.</Body>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Usage analytics</strong> — Which pages are visited most, how long sessions last, and where users navigate. No personally identifiable information is attached.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Performance monitoring</strong> — Load times, API response times, and page rendering metrics used to optimise the platform.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Error tracking</strong> — Automatically capturing JavaScript errors or failed requests so our team can resolve them quickly.</B>
                  </ul>
                </div>

                {/* Functional */}
                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '14px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#F5F3FF', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, color: '#6D28D9', fontFamily: FONT }}>Functional</div>
                    <SubH>C — Functional Cookies</SubH>
                  </div>
                  <Body>These cookies enhance your experience by remembering choices you have made on the platform.</Body>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Saved preferences</strong> — Remembering your dashboard layout, notification settings, and display choices.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Form progress</strong> — Preserving partially completed application or profile forms so your work is not lost if you navigate away.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Language &amp; region</strong> — Storing your locale settings if applicable.</B>
                  </ul>
                </div>

                {/* Security */}
                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#FFF7ED', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, color: '#92400E', fontFamily: FONT }}>Security</div>
                    <SubH>D — Security Cookies</SubH>
                  </div>
                  <Body>These cookies support our fraud prevention and platform integrity systems.</Body>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Bot &amp; abuse detection</strong> — Identifying and blocking automated attacks, credential stuffing, and scraping attempts.</B>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>Suspicious activity monitoring</strong> — Flagging unusual login patterns or access from unrecognised devices.</B>
                  </ul>
                </div>
              </div>
            </section>

            <Divider />

            {/* 04 · Third-Party Cookies */}
            <section id="third-party">
              <div ref={s4} style={fadeStyle}>
                <SectionLabel>04 — Third-Party Cookies</SectionLabel>
                <SH>Cookies set by our service partners</SH>
                <Body>
                  Some cookies on this platform are set by trusted third-party providers that help us deliver the service. Each partner operates under its own privacy policy and is subject to our data processing agreements.
                </Body>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
                  {[
                    { name: 'Supabase',           purpose: 'Authentication tokens, session management, and secure database access.',         link: 'https://supabase.com/privacy' },
                    { name: 'Vercel',              purpose: 'Edge delivery, hosting infrastructure, and performance diagnostics.',             link: 'https://vercel.com/legal/privacy-policy' },
                    { name: 'Analytics Provider', purpose: 'Aggregated, anonymised usage analytics. No personal identifiers are shared.',     link: null },
                    { name: 'Payment Processor',  purpose: 'Secure session handling during payment and payout flows.',                         link: null },
                  ].map(p => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F7FA', borderRadius: '10px', padding: '14px 18px', border: '1px solid #E5E7EB', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: FONT }}>{p.name}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px', fontFamily: FONT }}>{p.purpose}</div>
                      </div>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: '#2F80ED', textDecoration: 'none', fontWeight: 600, flexShrink: 0, fontFamily: FONT }}>
                          Privacy Policy ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <Callout>
                  We do not sell, rent, or share provider data with any third-party advertiser. Our third-party partners may only use data for the purposes described above and as set out in our data processing agreements.
                </Callout>
              </div>
            </section>

            <Divider />

            {/* 05 · Managing Cookies */}
            <section id="controls">
              <div ref={s5} style={fadeStyle}>
                <SectionLabel>05 — Managing Cookies</SectionLabel>
                <SH>How to control what is stored</SH>
                <Body>
                  You have the right to accept or decline non-essential cookies at any time. The most direct way to do this is through your browser settings. Here is how to do it in common browsers:
                </Body>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '22px' }}>
                  {[
                    { b: 'Chrome',  steps: 'Settings → Privacy and Security → Cookies and other site data' },
                    { b: 'Firefox', steps: 'Settings → Privacy & Security → Cookies and Site Data' },
                    { b: 'Safari',  steps: 'Preferences → Privacy → Manage Website Data' },
                    { b: 'Edge',    steps: 'Settings → Cookies and site permissions → Cookies and site data' },
                  ].map(({ b, steps }) => (
                    <div key={b} style={{ background: '#F5F7FA', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111', marginBottom: '4px', fontFamily: FONT }}>{b}</div>
                      <div style={{ fontSize: '12.5px', color: '#6B7280', lineHeight: 1.6, fontFamily: FONT }}>{steps}</div>
                    </div>
                  ))}
                </div>

                <Callout color="#FFF7ED" border="#F59E0B" text="#92400E">
                  Important: Disabling essential cookies will prevent you from signing in and accessing your provider dashboard. Core platform functionality relies on authentication and session cookies that cannot be removed without breaking your experience.
                </Callout>

                <Body>
                  You can also clear existing cookies stored by this site at any time via your browser&apos;s developer tools or privacy settings. This will sign you out of your current session.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 06 · Data Retention */}
            <section id="retention">
              <div ref={s6} style={fadeStyle}>
                <SectionLabel>06 — Data Retention</SectionLabel>
                <SH>How long cookies are kept</SH>
                <Body>
                  Different cookies have different lifespans depending on their purpose:
                </Body>

                <div style={{ border: '1px solid #E5E7EB', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
                  {[
                    { type: 'Session cookies',       duration: 'Until browser is closed or user signs out',     purpose: 'Authentication, CSRF protection' },
                    { type: 'Auth tokens',            duration: 'Up to 7 days (rolling)',                         purpose: 'Persistent login state' },
                    { type: 'Preference cookies',     duration: 'Up to 12 months',                                purpose: 'Saved UI preferences' },
                    { type: 'Analytics cookies',      duration: 'Up to 12 months',                                purpose: 'Anonymised usage data' },
                    { type: 'Security logs',          duration: 'Up to 90 days',                                  purpose: 'Fraud detection and review' },
                  ].map((row, i) => (
                    <div key={row.type} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.2fr', gap: '0', background: i % 2 === 0 ? '#fff' : '#F9FAFB', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none', padding: '12px 18px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111', fontFamily: FONT }}>{row.type}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: FONT }}>{row.duration}</div>
                      <div style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: FONT }}>{row.purpose}</div>
                    </div>
                  ))}
                </div>

                <Body>
                  When a cookie expires, your browser automatically removes it. You can also manually clear cookies at any time through your browser settings.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 07 · Legal Basis */}
            <section id="legal-basis">
              <div ref={s7} style={fadeStyle}>
                <SectionLabel>07 — Legal Basis</SectionLabel>
                <SH>Our compliance with Canadian privacy law</SH>
                <Body>
                  Our use of cookies is governed by Canada&apos;s federal <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable British Columbia privacy standards.
                </Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Legitimate interest</strong> — Essential and security cookies are deployed on the basis of legitimate interest: they are strictly necessary to provide the service you have registered for and requested.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Consent</strong> — Non-essential cookies (analytics and functional) are deployed where we have obtained your implied consent through continued use of the platform, consistent with PIPEDA transparency requirements.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Transparency</strong> — We make this Cookie Policy publicly available and clearly disclose which technologies we use, why, and for how long.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Your rights</strong> — You can withdraw consent for non-essential cookies at any time by adjusting your browser settings, as described in Section 05.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 08 · Updates */}
            <section id="updates">
              <div ref={s8} style={fadeStyle}>
                <SectionLabel>08 — Policy Updates</SectionLabel>
                <SH>How we handle changes</SH>
                <Body>
                  Urbance may update this Cookie Policy from time to time to reflect changes to the technologies we use, new legal requirements, or improvements to the platform.
                </Body>
                <Body>
                  When changes are made, we will update the &ldquo;Last Updated&rdquo; date at the top of this page. For material changes, we will provide advance notice via email or an in-platform notification.
                </Body>
                <Body>
                  Your continued use of the Urbance platform after any update to this policy constitutes your acceptance of the revised terms. If you disagree with any changes, you may adjust your cookie settings or contact us to discuss your options.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 09 · Contact */}
            <section id="contact">
              <div ref={s9} style={fadeStyle}>
                <SectionLabel>09 — Contact Us</SectionLabel>
                <SH>Questions about cookies?</SH>
                <Body>
                  If you have any questions, concerns, or requests relating to this Cookie Policy or our use of tracking technologies, please contact us:
                </Body>
                <div style={{ background: '#F5F7FA', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Privacy &amp; Legal</p>
                      <a href="mailto:privacy@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>privacy@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>General Support</p>
                      <a href="mailto:support@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>support@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Mailing Address</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                        Urbance Inc.<br />Metro Vancouver, BC<br />Canada
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Response Time</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                        Within 30 days<br />(usually 5 business days)
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/privacy"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: '#2F80ED', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, boxShadow: '0 4px 18px rgba(47,128,237,0.24)' }}
                  >
                    Privacy Policy
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                  <Link
                    href="/terms"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: '#F5F7FA', color: '#374151', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, border: '1px solid #E5E7EB' }}
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* ─── FOOTER STRIP ─── */}
        <div style={{ background: '#F5F7FA', borderTop: '1px solid #E5E7EB', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, fontFamily: FONT }}>
            © {new Date().getFullYear()} Urbance Inc. &nbsp;·&nbsp; All rights reserved. &nbsp;·&nbsp;
            <Link href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</Link>
            &nbsp;·&nbsp;
            <Link href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</Link>
          </p>
        </div>

      </main>

      <Footer />
    </>
  );
}
