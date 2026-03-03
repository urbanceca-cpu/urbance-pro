'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
  { id: 'introduction',        label: 'Introduction' },
  { id: 'information-collect', label: 'Information We Collect' },
  { id: 'how-we-use',          label: 'How We Use Your Information' },
  { id: 'data-sharing',        label: 'Data Sharing' },
  { id: 'storage-security',    label: 'Storage & Security' },
  { id: 'provider-rights',     label: 'Your Rights' },
  { id: 'cookies',             label: 'Cookies & Tracking' },
  { id: 'third-party',         label: 'Third-Party Services' },
  { id: 'contact',             label: 'Contact Us' },
];

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ─── Small reusable primitives ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 14px', fontFamily: FONT }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: '0 0 18px', letterSpacing: '-0.025em', lineHeight: 1.3, fontFamily: FONT }}>
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '24px 0 10px', letterSpacing: '-0.01em', fontFamily: FONT }}>
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 14px', fontFamily: FONT }}>
      {children}
    </p>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #F3F4F6', listStyle: 'none' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2F80ED', flexShrink: 0, marginTop: '8px' }} />
      <span style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, fontFamily: FONT }}>{children}</span>
    </li>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: '#F3F4F6', margin: '48px 0' }} />;
}

export default function PrivacyPage() {
  const heroRef    = useFadeIn();
  const tocRef     = useFadeIn();
  const sec1Ref    = useFadeIn();
  const sec2Ref    = useFadeIn();
  const sec3Ref    = useFadeIn();
  const sec4Ref    = useFadeIn();
  const sec5Ref    = useFadeIn();
  const sec6Ref    = useFadeIn();
  const sec7Ref    = useFadeIn();
  const sec8Ref    = useFadeIn();
  const sec9Ref    = useFadeIn();

  const fadeStyle: React.CSSProperties = { opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' };

  return (
    <>
      <Navbar />

      <main style={{ fontFamily: FONT, color: '#111', background: '#fff' }}>

        {/* ─── HERO ─── */}
        <section style={{ padding: '140px 24px 80px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
          <div ref={heroRef} style={{ ...fadeStyle, maxWidth: '760px', margin: '0 auto' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 20px' }}>Legal</p>
            <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#111', margin: '0 0 18px', lineHeight: 1.06 }}>
              Provider Privacy Policy
            </h1>
            <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.75, maxWidth: '580px', margin: '0 0 28px' }}>
              This policy applies to service professionals — tradespeople, cleaners, and other providers — who register and operate on the Urbance platform. It explains what data we collect, why we collect it, and how we protect it.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F7FA', borderRadius: '8px', padding: '8px 16px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Last updated: March 2, 2026</span>
            </div>
          </div>
        </section>

        {/* ─── LAYOUT WRAPPER ─── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 96px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '64px', alignItems: 'start' }} className="legal-layout">

          {/* ─── STICKY TABLE OF CONTENTS ─── */}
          <aside ref={tocRef} style={{ ...fadeStyle, position: 'sticky', top: '100px' }} className="legal-toc">
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 16px' }}>Contents</p>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', fontSize: '13.5px', color: '#6B7280', textDecoration: 'none', borderBottom: i < TOC.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'color 0.15s', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2F80ED')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                    >
                      <span style={{ width: '18px', fontSize: '12px', color: '#D1D5DB', fontWeight: 600, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div>

            {/* 1 · Introduction */}
            <section id="introduction">
              <div ref={sec1Ref} style={fadeStyle}>
                <SectionLabel>01 — Introduction</SectionLabel>
                <SectionHeading>About this Policy</SectionHeading>
                <Body>
                  Urbance Inc. (&ldquo;Urbance&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) operates <strong>pros.urbance.ca</strong> — the platform used by independent service professionals to manage their profile, accept jobs, and receive payments. This Privacy Policy explains how we handle the personal, business, and operational data of registered providers.
                </Body>
                <Body>
                  By registering as a provider, you consent to the practices described in this policy. This policy is compliant with Canada&apos;s federal <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable British Columbia privacy legislation.
                </Body>
                <Body>
                  If you are a customer using <strong>urbance.ca</strong>, please refer to the separate Consumer Privacy Policy available on the main Urbance website.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 2 · Information We Collect */}
            <section id="information-collect">
              <div ref={sec2Ref} style={fadeStyle}>
                <SectionLabel>02 — Information We Collect</SectionLabel>
                <SectionHeading>What data we gather and why</SectionHeading>
                <Body>
                  We collect only what is necessary to operate the platform, verify your qualifications, process payments, and keep the marketplace safe. Here is a breakdown by category.
                </Body>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                  <SubHeading>A — Account Information</SubHeading>
                  <ul style={{ margin: '0', padding: 0 }}>
                    <Bullet>Full legal name</Bullet>
                    <Bullet>Email address and phone number</Bullet>
                    <Bullet>Business or trade name (if applicable)</Bullet>
                    <Bullet>Service categories and geographic coverage area</Bullet>
                    <Bullet>Profile photo and bio</Bullet>
                  </ul>
                </div>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                  <SubHeading>B — Verification Information</SubHeading>
                  <Body>Required to maintain a trusted marketplace for customers.</Body>
                  <ul style={{ margin: '0', padding: 0 }}>
                    <Bullet>Government-issued photo ID</Bullet>
                    <Bullet>Proof of liability insurance</Bullet>
                    <Bullet>Trade certifications and licenses</Bullet>
                    <Bullet>Background check information (where applicable)</Bullet>
                    <Bullet>Eligibility to work in Canada documentation</Bullet>
                  </ul>
                </div>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                  <SubHeading>C — Operational Data</SubHeading>
                  <Body>Generated through your activity on the platform.</Body>
                  <ul style={{ margin: '0', padding: 0 }}>
                    <Bullet>Job history — accepted, completed, and cancelled jobs</Bullet>
                    <Bullet>Earnings records and payout history</Bullet>
                    <Bullet>Customer ratings and written reviews</Bullet>
                    <Bullet>In-platform messages and support communications</Bullet>
                    <Bullet>Availability settings and schedule preferences</Bullet>
                  </ul>
                </div>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', border: '1px solid #E5E7EB' }}>
                  <SubHeading>D — Technical Data</SubHeading>
                  <Body>Collected automatically when you use the platform.</Body>
                  <ul style={{ margin: '0', padding: 0 }}>
                    <Bullet>IP address and approximate location</Bullet>
                    <Bullet>Browser type and device information</Bullet>
                    <Bullet>Session cookies and authentication tokens</Bullet>
                    <Bullet>Usage logs — pages visited, actions taken, timestamps</Bullet>
                    <Bullet>Error reports and performance diagnostics</Bullet>
                  </ul>
                </div>
              </div>
            </section>

            <Divider />

            {/* 3 · How We Use Information */}
            <section id="how-we-use">
              <div ref={sec3Ref} style={fadeStyle}>
                <SectionLabel>03 — How We Use Your Information</SectionLabel>
                <SectionHeading>The purposes behind data collection</SectionHeading>
                <Body>
                  Every piece of data we hold serves a specific, legitimate purpose. We do not collect information speculatively or &ldquo;just in case.&rdquo; Below are the primary reasons we process your data.
                </Body>
                <ul style={{ margin: '0', padding: 0 }}>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Account management</strong> — Creating and maintaining your provider profile, login credentials, and settings.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Identity & credential verification</strong> — Confirming your identity, insurance, and qualifications before you go live on the platform.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Job matching</strong> — Connecting you with relevant service requests in your area and category.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Payment processing</strong> — Calculating earnings, processing payouts, and generating financial records.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Platform safety & fraud prevention</strong> — Detecting suspicious activity, resolving disputes, and protecting customers and providers alike.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Communications</strong> — Sending job notifications, payout confirmations, policy updates, and support messages.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Legal compliance</strong> — Meeting obligations under Canadian law, including tax reporting requirements.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Platform improvement</strong> — Analysing aggregated usage data to improve features and performance.</Bullet>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 4 · Data Sharing */}
            <section id="data-sharing">
              <div ref={sec4Ref} style={fadeStyle}>
                <SectionLabel>04 — Data Sharing</SectionLabel>
                <SectionHeading>Who can see your information</SectionHeading>
                <div style={{ background: '#EBF3FD', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', borderLeft: '3px solid #2F80ED' }}>
                  <p style={{ margin: 0, fontSize: '14.5px', color: '#1E40AF', fontWeight: 600, lineHeight: 1.6, fontFamily: FONT }}>
                    We do not sell, rent, or trade your personal information to any third party — ever.
                  </p>
                </div>
                <Body>
                  Your data is shared only when it is operationally necessary or legally required. The following parties may receive limited information:
                </Body>
                <ul style={{ margin: '0', padding: 0 }}>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Customers</strong> — When you accept a job, customers see your name, profile photo, service category, and rating. They do not see your government ID, banking details, or other sensitive documents.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Payment processors</strong> — Banking and payout information is shared with our payment processor solely to execute your weekly transfers.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Background check providers</strong> — If a background check is required for your service category, your identifying information will be shared with our vetted screening partner.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Legal authorities</strong> — We will disclose information if required by a valid court order, law enforcement request, or applicable Canadian law.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Infrastructure providers</strong> — Our cloud and database providers process data on our behalf and are bound by strict data processing agreements.</Bullet>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 5 · Storage & Security */}
            <section id="storage-security">
              <div ref={sec5Ref} style={fadeStyle}>
                <SectionLabel>05 — Storage &amp; Security</SectionLabel>
                <SectionHeading>How we protect your data</SectionHeading>
                <Body>
                  We take the security of your information seriously. All provider data — including verification documents and financial records — is stored on encrypted, access-controlled infrastructure.
                </Body>
                <ul style={{ margin: '0', padding: 0 }}>
                  <Bullet>All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher.</Bullet>
                  <Bullet>Sensitive documents (ID, insurance, licences) are stored in encrypted, private cloud storage with strict access controls.</Bullet>
                  <Bullet>Access to your personal data internally is restricted to team members with a legitimate operational need.</Bullet>
                  <Bullet>Authentication tokens and session data are stored securely and expire automatically.</Bullet>
                  <Bullet>We conduct periodic security reviews and follow industry best practices for data handling.</Bullet>
                </ul>
                <Body>
                  We retain your data for as long as your account is active or as required to fulfil legal, tax, or regulatory obligations. When you request account deletion, we will remove or anonymise your personal data within 30 days, except where retention is legally required (e.g., financial records for tax purposes, which are retained for 7 years).
                </Body>
              </div>
            </section>

            <Divider />

            {/* 6 · Provider Rights */}
            <section id="provider-rights">
              <div ref={sec6Ref} style={fadeStyle}>
                <SectionLabel>06 — Your Rights</SectionLabel>
                <SectionHeading>Control over your own data</SectionHeading>
                <Body>
                  Under PIPEDA and applicable provincial legislation, you have the following rights with respect to your personal information:
                </Body>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { icon: '📋', title: 'Access',      desc: 'Request a copy of the personal data we hold about you.' },
                    { icon: '✏️', title: 'Correction',  desc: 'Ask us to correct inaccurate or outdated information.' },
                    { icon: '🗑️', title: 'Deletion',    desc: 'Request deletion of your account and personal data, subject to legal retention requirements.' },
                    { icon: '🔒', title: 'Withdraw Consent', desc: 'Where processing is based on consent, you may withdraw it at any time.' },
                  ].map(r => (
                    <div key={r.title} style={{ background: '#F5F7FA', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '22px', marginBottom: '10px' }}>{r.icon}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '6px', fontFamily: FONT }}>{r.title}</div>
                      <div style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: 1.65, fontFamily: FONT }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
                <Body>
                  To exercise any of these rights, email us at <a href="mailto:privacy@urbance.ca" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>privacy@urbance.ca</a>. We will respond within 30 days of receiving your request.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 7 · Cookies */}
            <section id="cookies">
              <div ref={sec7Ref} style={fadeStyle}>
                <SectionLabel>07 — Cookies &amp; Tracking</SectionLabel>
                <SectionHeading>How we use browser data</SectionHeading>
                <Body>
                  We use cookies and similar technologies to keep you signed in, understand how the platform is used, and improve your experience. We do not use cookies for advertising or cross-site tracking.
                </Body>
                <ul style={{ margin: '0', padding: 0 }}>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Essential cookies</strong> — Required for authentication and core platform functionality. These cannot be disabled without breaking the platform.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Analytics cookies</strong> — Anonymous usage data (pages visited, time on page) that help us improve the platform. No personal identifiers are attached.</Bullet>
                  <Bullet><strong style={{ color: '#111', fontWeight: 600 }}>Session tracking</strong> — Temporary tokens that maintain your logged-in state and expire when you sign out or after a period of inactivity.</Bullet>
                </ul>
                <Body>
                  You can disable non-essential cookies through your browser settings. Note that disabling essential cookies will prevent you from signing in. For more details, see our <Link href="/cookies" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>Cookie Policy</Link>.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 8 · Third-Party Services */}
            <section id="third-party">
              <div ref={sec8Ref} style={fadeStyle}>
                <SectionLabel>08 — Third-Party Services</SectionLabel>
                <SectionHeading>Partners who help us operate</SectionHeading>
                <Body>
                  Urbance uses trusted third-party services to deliver the platform. Each is subject to its own privacy policy and our data processing agreements. Current service partners include:
                </Body>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { name: 'Supabase',            role: 'Database, authentication, and secure file storage',       link: 'https://supabase.com/privacy' },
                    { name: 'Stripe / E-Transfer',  role: 'Payment processing and provider payouts',                  link: 'https://stripe.com/privacy' },
                    { name: 'Vercel',               role: 'Platform hosting and edge delivery',                       link: 'https://vercel.com/legal/privacy-policy' },
                    { name: 'Analytics Provider',   role: 'Aggregated, anonymised usage analytics',                   link: '#' },
                    { name: 'Background Screening', role: 'Identity and credential verification (where required)',    link: '#' },
                  ].map(p => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F7FA', borderRadius: '10px', padding: '14px 18px', border: '1px solid #E5E7EB', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: FONT }}>{p.name}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px', fontFamily: FONT }}>{p.role}</div>
                      </div>
                      {p.link !== '#' && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: '#2F80ED', textDecoration: 'none', fontWeight: 600, flexShrink: 0, fontFamily: FONT }}>
                          Privacy Policy ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <Body>
                  We vet all third-party services for data security standards before integration and review these relationships regularly.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 9 · Contact */}
            <section id="contact">
              <div ref={sec9Ref} style={fadeStyle}>
                <SectionLabel>09 — Contact Us</SectionLabel>
                <SectionHeading>Questions about your privacy?</SectionHeading>
                <Body>
                  If you have questions, concerns, or requests relating to this Privacy Policy or your personal data, please reach out:
                </Body>
                <div style={{ background: '#F5F7FA', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Privacy Enquiries</p>
                      <a href="mailto:privacy@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>privacy@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>General Support</p>
                      <a href="mailto:support@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>support@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Mailing Address</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                        Urbance Inc.<br />
                        Metro Vancouver, British Columbia<br />
                        Canada
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Response Time</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>Within 30 days of receipt<br />(usually within 5 business days)</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/dashboard/support"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: '#2F80ED', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, boxShadow: '0 4px 18px rgba(47,128,237,0.24)' }}
                  >
                    Open a Support Ticket
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

        {/* ─── FOOTER BANNER ─── */}
        <div style={{ background: '#F5F7FA', borderTop: '1px solid #E5E7EB', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0, fontFamily: FONT }}>
            © {new Date().getFullYear()} Urbance Inc. &nbsp;·&nbsp; All rights reserved. &nbsp;·&nbsp;
            <Link href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</Link>
            &nbsp;·&nbsp;
            <Link href="/cookies" style={{ color: '#6B7280', textDecoration: 'none' }}>Cookie Policy</Link>
          </p>
        </div>

      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        @media (max-width: 768px) {
          .legal-layout { grid-template-columns: 1fr !important; padding: 40px 16px 60px !important; }
          .legal-toc    { display: none !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
