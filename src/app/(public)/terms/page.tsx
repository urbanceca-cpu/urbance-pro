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
  { id: 'introduction',       label: 'Introduction' },
  { id: 'eligibility',        label: 'Eligibility & Registration' },
  { id: 'contractor-status',  label: 'Independent Contractor' },
  { id: 'service-standards',  label: 'Service Standards' },
  { id: 'bookings',           label: 'Bookings & Jobs' },
  { id: 'fees-payments',      label: 'Fees & Payments' },
  { id: 'ratings',            label: 'Ratings & Reviews' },
  { id: 'verification',       label: 'Document Verification' },
  { id: 'suspension',         label: 'Suspension & Termination' },
  { id: 'liability',          label: 'Limitation of Liability' },
  { id: 'indemnification',    label: 'Indemnification' },
  { id: 'disputes',           label: 'Dispute Resolution' },
  { id: 'changes',            label: 'Changes to Terms' },
  { id: 'contact',            label: 'Contact Us' },
];

/* ─── Primitives ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 14px', fontFamily: FONT }}>{children}</p>;
}
function SH({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: '0 0 18px', letterSpacing: '-0.025em', lineHeight: 1.3, fontFamily: FONT }}>{children}</h2>;
}
function SubH({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '24px 0 10px', letterSpacing: '-0.01em', fontFamily: FONT }}>{children}</h3>;
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
  return <div style={{ background: color, borderRadius: '12px', padding: '16px 20px', marginBottom: '22px', borderLeft: `3px solid ${border}` }}><p style={{ margin: 0, fontSize: '14.5px', color: text, fontWeight: 600, lineHeight: 1.65, fontFamily: FONT }}>{children}</p></div>;
}
function Divider() {
  return <div style={{ height: '1px', background: '#F3F4F6', margin: '48px 0' }} />;
}

const fadeStyle: React.CSSProperties = { opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' };

export default function TermsPage() {
  const heroRef  = useFadeIn();
  const tocRef   = useFadeIn();
  const s1  = useFadeIn(); const s2  = useFadeIn(); const s3  = useFadeIn();
  const s4  = useFadeIn(); const s5  = useFadeIn(); const s6  = useFadeIn();
  const s7  = useFadeIn(); const s8  = useFadeIn(); const s9  = useFadeIn();
  const s10 = useFadeIn(); const s11 = useFadeIn(); const s12 = useFadeIn();
  const s13 = useFadeIn(); const s14 = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{ fontFamily: FONT, color: '#111', background: '#fff' }}>

        {/* ─── HERO ─── */}
        <section style={{ padding: '140px 24px 80px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
          <div ref={heroRef} style={{ ...fadeStyle, maxWidth: '760px', margin: '0 auto' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2F80ED', margin: '0 0 20px' }}>Legal</p>
            <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#111', margin: '0 0 18px', lineHeight: 1.06 }}>
              Provider Terms of Service
            </h1>
            <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.75, maxWidth: '600px', margin: '0 0 28px' }}>
              These Terms govern your use of the Urbance platform as a registered service professional. By creating an account, you agree to be bound by the conditions set out below. Please read them carefully.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F7FA', borderRadius: '8px', padding: '8px 16px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Last updated: March 2, 2026</span>
            </div>
          </div>
        </section>

        {/* ─── TWO-COLUMN LAYOUT ─── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 96px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '64px', alignItems: 'start' }} className="legal-layout">

          {/* ─── STICKY TOC ─── */}
          <aside ref={tocRef} style={{ ...fadeStyle, position: 'sticky', top: '100px' }} className="legal-toc">
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
                <SH>Agreement to These Terms</SH>
                <Body>
                  These Provider Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;Provider&rdquo;, &ldquo;you&rdquo;) and Urbance Inc. (&ldquo;Urbance&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) governing your access to and use of the Urbance platform at <strong>pros.urbance.ca</strong>.
                </Body>
                <Body>
                  By registering as a service provider, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>. If you do not agree, you must not register or use the platform.
                </Body>
                <Callout>
                  Urbance operates as a technology marketplace that connects independent service professionals with customers. We are not an employer, staffing agency, or contractor in any transaction between a Provider and a customer.
                </Callout>
                <Body>
                  These Terms apply to all individuals and sole proprietors who register on the Urbance platform as service providers, regardless of service category. These Terms are governed by the laws of British Columbia, Canada.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 02 · Eligibility */}
            <section id="eligibility">
              <div ref={s2} style={fadeStyle}>
                <SectionLabel>02 — Eligibility &amp; Account Registration</SectionLabel>
                <SH>Who can register as a Provider</SH>
                <Body>To register and operate as a Provider on the Urbance platform, you must meet the following requirements at all times:</Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>Be at least 18 years of age.</B>
                  <B>Be legally eligible to work in Canada and, where applicable, registered to operate a business in British Columbia.</B>
                  <B>Hold valid and current certifications, trade licences, and professional credentials required for the services you offer.</B>
                  <B>Carry adequate liability insurance as required by Urbance (minimum $2,000,000 general liability for most categories).</B>
                  <B>Provide accurate, complete, and non-misleading information during registration and throughout your use of the platform.</B>
                  <B>Maintain the security of your account credentials and not share login access with any other person.</B>
                  <B>Promptly update your account information if any details change, including insurance, certifications, or business status.</B>
                </ul>
                <Body>
                  Urbance reserves the right to refuse or revoke registration to any individual who does not meet these eligibility requirements or who provides false or misleading information.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 03 · Independent Contractor */}
            <section id="contractor-status">
              <div ref={s3} style={fadeStyle}>
                <SectionLabel>03 — Independent Contractor Status</SectionLabel>
                <SH>You are not an employee of Urbance</SH>
                <Callout color="#FFF7ED" border="#F59E0B" text="#92400E">
                  This is one of the most important sections of these Terms. Your relationship with Urbance is strictly that of an independent contractor. Nothing in these Terms creates an employment, agency, partnership, joint venture, or franchise relationship.
                </Callout>
                <Body>As an independent contractor, you expressly acknowledge and agree that:</Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>You are solely responsible for remitting all applicable income taxes, GST/HST, and other statutory remittances to the Canada Revenue Agency.</B>
                  <B>You are not entitled to employment insurance (EI), Canada Pension Plan contributions (CPP), or any other employee benefits from Urbance.</B>
                  <B>You are responsible for obtaining and maintaining your own workers&apos; compensation coverage (WCB/WorkSafeBC) where applicable to your trade or service category.</B>
                  <B>You retain full discretion over how, when, and where you perform services — subject to the job scope accepted and these Terms.</B>
                  <B>You may perform services for other clients, platforms, or businesses simultaneously, unless a specific job agreement restricts this.</B>
                  <B>Urbance does not direct, control, or supervise the manner in which you perform services.</B>
                </ul>
                <Body>
                  If any governmental authority determines that your relationship with Urbance constitutes employment, you agree to cooperate with Urbance and indemnify Urbance against any resulting liabilities, taxes, or penalties.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 04 · Service Standards */}
            <section id="service-standards">
              <div ref={s4} style={fadeStyle}>
                <SectionLabel>04 — Service Standards</SectionLabel>
                <SH>How we expect Providers to operate</SH>
                <Body>
                  The quality and safety of every job reflects on you, the customer, and the Urbance platform. You agree to uphold the following standards on every engagement booked through the platform:
                </Body>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
                  <SubH>Professional Conduct</SubH>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B>Arrive on time and notify the customer promptly if you are delayed.</B>
                    <B>Treat all customers with courtesy and respect, regardless of circumstances.</B>
                    <B>Maintain a clean, professional appearance appropriate to your trade.</B>
                    <B>Complete jobs to the standard described in the booking, and flag any scope changes before proceeding.</B>
                  </ul>
                </div>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
                  <SubH>Safety &amp; Compliance</SubH>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B>Comply with all applicable WorkSafeBC regulations and occupational health and safety standards relevant to your trade.</B>
                    <B>Use appropriate tools, protective equipment, and safety procedures at all times.</B>
                    <B>Do not perform work that you are not qualified, licensed, or insured to perform.</B>
                    <B>Report any workplace incidents or injuries to Urbance support within 24 hours.</B>
                  </ul>
                </div>

                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', border: '1px solid #E5E7EB' }}>
                  <SubH>Platform Integrity</SubH>
                  <ul style={{ margin: 0, padding: 0 }}>
                    <B><strong style={{ color: '#111', fontWeight: 600 }}>No off-platform solicitation.</strong> You may not solicit customers you meet through Urbance to book services outside the platform, either directly or through a third party.</B>
                    <B>Do not share, reproduce, or misuse any customer personal data obtained through the platform.</B>
                    <B>Do not misrepresent your qualifications, experience, or business status.</B>
                  </ul>
                </div>
              </div>
            </section>

            <Divider />

            {/* 05 · Bookings */}
            <section id="bookings">
              <div ref={s5} style={fadeStyle}>
                <SectionLabel>05 — Bookings &amp; Job Acceptance</SectionLabel>
                <SH>How jobs work on the platform</SH>
                <Body>
                  Job requests are surfaced to eligible Providers based on service category, geographic availability, and profile completeness. You have full discretion over which jobs you accept. However, once a job is accepted, the following rules apply:
                </Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Acceptance</strong> — Accepting a job is a binding commitment to complete it as described. Do not accept jobs you do not intend or are unable to complete.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Cancellations</strong> — Cancellations with less than 24 hours&apos; notice may result in a cancellation flag on your account. Repeated short-notice cancellations may affect your job priority ranking and account status.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Late arrivals</strong> — If you will be more than 15 minutes late, you must notify the customer through the platform immediately. Unexplained late arrivals negatively affect your rating.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>No-shows</strong> — Failing to appear for an accepted booking without notice is a serious violation of these Terms and may result in immediate account suspension.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Job completion</strong> — Mark jobs as complete only when the work has been fully performed and the customer has been informed. Fraudulent completion claims may result in account termination.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 06 · Fees & Payments */}
            <section id="fees-payments">
              <div ref={s6} style={fadeStyle}>
                <SectionLabel>06 — Fees &amp; Payments</SectionLabel>
                <SH>How pricing and payouts work</SH>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }} className="terms-inner-grid">
                  {[
                    { v: '10%',    label: 'Platform commission',  sub: 'On completed jobs only' },
                    { v: 'Weekly', label: 'Payout schedule',       sub: 'Every Friday' },
                    { v: '$0',     label: 'Sign-up or monthly fee', sub: 'No hidden charges' },
                  ].map(s => (
                    <div key={s.v} style={{ background: '#F5F7FA', borderRadius: '12px', padding: '18px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#111', letterSpacing: '-0.04em' }}>{s.v}</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#374151', marginTop: '4px' }}>{s.label}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Commission</strong> — Urbance deducts a 10% platform fee from the total job value before processing your payout. This fee covers payment processing, platform maintenance, customer support, and marketing.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Payout schedule</strong> — Earnings from completed and verified jobs are processed weekly every Friday via direct deposit or Interac e-Transfer. Funds typically arrive within 1–3 business days depending on your financial institution.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Pricing control</strong> — You set your own rates. Urbance does not dictate pricing but provides market-rate guidance. Rates must be disclosed to customers before a job is accepted.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Refunds and adjustments</strong> — If a customer dispute results in a refund being issued, the corresponding payout (minus processing costs) may be reversed or withheld from your account.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Chargebacks</strong> — In the event of a chargeback initiated by a customer, Urbance may temporarily withhold your payout while the dispute is investigated. You agree to cooperate fully during this process.</B>
                  <B><strong style={{ color: '#111', fontWeight: 600 }}>Tax responsibility</strong> — You are solely responsible for all applicable taxes on your earnings, including income tax and GST/HST where applicable. Urbance will issue annual earnings summaries to assist with your reporting obligations.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 07 · Ratings */}
            <section id="ratings">
              <div ref={s7} style={fadeStyle}>
                <SectionLabel>07 — Ratings &amp; Reviews</SectionLabel>
                <SH>How feedback works</SH>
                <Body>
                  After each completed job, customers have the opportunity to rate their experience (1–5 stars) and leave a written review. Your overall rating is a running average of all reviews and is visible on your public profile.
                </Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>Urbance reserves the right to moderate, remove, or investigate reviews that violate our content standards, including reviews containing personal attacks, profanity, or unverifiable claims.</B>
                  <B>Attempting to manipulate your own rating — whether by submitting fake reviews, soliciting biased reviews, or pressuring customers — is strictly prohibited and may result in account termination.</B>
                  <B>If you believe a review is fraudulent or retaliatory, contact support@urbance.ca with relevant details. We will investigate within a reasonable timeframe.</B>
                  <B>Sustained low ratings (below 3.5 over 10+ reviews) may trigger a performance review, a temporary reduction in job priority, or account suspension.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 08 · Verification */}
            <section id="verification">
              <div ref={s8} style={fadeStyle}>
                <SectionLabel>08 — Document Verification</SectionLabel>
                <SH>Credentials, licences, and identity</SH>
                <Body>
                  The Urbance marketplace is built on trust. Customers rely on the fact that every Provider has been vetted. Accordingly, you agree to the following:
                </Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>You must upload all required documents at registration, including government-issued ID, proof of insurance, and applicable trade licences or certifications.</B>
                  <B>All submitted documents must be authentic, current, and unaltered. Submitting forged, expired, or fraudulent documents is a serious breach of these Terms and may be referred to law enforcement.</B>
                  <B>You must notify Urbance promptly if any credential expires, is revoked, or is subject to any regulatory action — and must not continue performing affected services in the interim.</B>
                  <B>Urbance may conduct periodic re-verification of credentials and background checks. Failure to cooperate with re-verification may result in account suspension.</B>
                  <B>Background checks, where required, are conducted by an approved third-party screening provider. You consent to this process as a condition of maintaining your account.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 09 · Suspension */}
            <section id="suspension">
              <div ref={s9} style={fadeStyle}>
                <SectionLabel>09 — Suspension &amp; Termination</SectionLabel>
                <SH>When accounts may be closed</SH>
                <Body>
                  Urbance reserves the right to suspend, restrict, or permanently terminate any Provider account, with or without notice, where Urbance determines in its reasonable discretion that there has been a violation of these Terms, applicable law, or platform policies. Grounds include but are not limited to:
                </Body>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '22px' }} className="terms-inner-grid">
                  {[
                    { icon: '🚫', t: 'Fraud or misrepresentation',        d: 'Providing false identity, credentials, or business information.' },
                    { icon: '⚠️', t: 'Safety violations',                   d: 'Conduct that endangers customer, public, or occupational safety.' },
                    { icon: '📉', t: 'Persistent poor performance',        d: 'Sustained low ratings, repeated no-shows, or unresolved disputes.' },
                    { icon: '🔒', t: 'Terms breach',                        d: 'Any material breach of these Terms or platform policies.' },
                    { icon: '💬', t: 'Harassment or misconduct',            d: 'Abusive, discriminatory, or threatening behaviour toward customers.' },
                    { icon: '📤', t: 'Off-platform solicitation',           d: 'Diverting platform customers to book outside of Urbance.' },
                  ].map(r => (
                    <div key={r.t} style={{ background: '#F5F7FA', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '18px', marginBottom: '8px' }}>{r.icon}</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111', marginBottom: '4px', fontFamily: FONT }}>{r.t}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontFamily: FONT }}>{r.d}</div>
                    </div>
                  ))}
                </div>

                <Body>
                  <strong style={{ color: '#111' }}>Voluntary closure:</strong> You may close your account at any time by contacting support@urbance.ca. You must complete all accepted jobs and resolve any pending payments before deletion can be processed.
                </Body>
                <Body>
                  Upon termination, your right to access the platform ceases immediately. Sections of these Terms that by their nature should survive termination — including Sections 03, 10, 11, 12, and 13 — remain in full force.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 10 · Liability */}
            <section id="liability">
              <div ref={s10} style={fadeStyle}>
                <SectionLabel>10 — Limitation of Liability</SectionLabel>
                <SH>The scope of Urbance&apos;s responsibility</SH>
                <Callout>
                  Urbance is a technology platform that facilitates connections between independent Providers and customers. We are not a party to the service transaction itself and are not liable for the quality, safety, timeliness, or outcome of any services performed.
                </Callout>
                <Body>To the fullest extent permitted by applicable law:</Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>Urbance is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or performance of services.</B>
                  <B>Urbance does not guarantee a minimum volume of jobs, bookings, or earnings. The availability of jobs depends on market demand, your location, service category, and profile quality.</B>
                  <B>In any event, Urbance&apos;s total aggregate liability to you shall not exceed the total platform fees paid by you to Urbance in the 90 days preceding the event giving rise to the claim.</B>
                  <B>Urbance does not guarantee that the platform will be available at all times, free of errors, or secure from all external threats, though we make all reasonable efforts to ensure uptime and security.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 11 · Indemnification */}
            <section id="indemnification">
              <div ref={s11} style={fadeStyle}>
                <SectionLabel>11 — Indemnification</SectionLabel>
                <SH>Your responsibility to protect Urbance</SH>
                <Body>
                  You agree to indemnify, defend, and hold harmless Urbance Inc., its directors, officers, employees, agents, and successors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with:
                </Body>
                <ul style={{ margin: '0 0 20px', padding: 0 }}>
                  <B>Your performance of services (or failure to perform), including property damage, personal injury, or death caused by your actions or negligence.</B>
                  <B>Your violation of these Terms, any applicable law, or any third-party rights.</B>
                  <B>Any misrepresentation regarding your qualifications, certifications, or identity.</B>
                  <B>Any tax liability, regulatory fine, or penalty arising from your activities as an independent contractor.</B>
                  <B>Any customer dispute resulting from a service you performed through the platform.</B>
                </ul>
              </div>
            </section>

            <Divider />

            {/* 12 · Disputes */}
            <section id="disputes">
              <div ref={s12} style={fadeStyle}>
                <SectionLabel>12 — Dispute Resolution</SectionLabel>
                <SH>How disagreements are resolved</SH>
                <Body>
                  In the event of any dispute, controversy, or claim arising out of or relating to these Terms or your use of the Urbance platform, the parties agree to the following resolution process:
                </Body>
                <div style={{ background: '#F5F7FA', borderRadius: '14px', padding: '24px 28px', border: '1px solid #E5E7EB', marginBottom: '18px' }}>
                  <SubH>Step 1 — Good Faith Negotiation</SubH>
                  <Body>Contact Urbance support at <a href="mailto:legal@urbance.ca" style={{ color: '#2F80ED', textDecoration: 'none', fontWeight: 500 }}>legal@urbance.ca</a> and describe the issue in writing. Both parties will attempt to resolve the dispute informally within 30 days.</Body>
                  <SubH>Step 2 — Mediation</SubH>
                  <Body>If informal resolution fails, the parties may agree to non-binding mediation through a mutually accepted mediator in British Columbia.</Body>
                  <SubH>Step 3 — Governing Law &amp; Jurisdiction</SubH>
                  <Body>These Terms are governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein. Any proceedings not resolved through the above steps shall be submitted to the exclusive jurisdiction of the courts of British Columbia.</Body>
                </div>
                <Body>
                  Nothing in this section prevents either party from seeking injunctive or other equitable relief from a court of competent jurisdiction where such relief is necessary to prevent irreparable harm.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 13 · Changes */}
            <section id="changes">
              <div ref={s13} style={fadeStyle}>
                <SectionLabel>13 — Changes to These Terms</SectionLabel>
                <SH>How we update this agreement</SH>
                <Body>
                  Urbance reserves the right to modify, update, or replace any portion of these Terms at any time. When changes are made, we will update the &ldquo;Last Updated&rdquo; date at the top of this page.
                </Body>
                <Body>
                  For significant changes, we will endeavour to provide advance notice via email or a platform notification. Your continued use of the Urbance platform after any changes constitutes your binding acceptance of the revised Terms.
                </Body>
                <Body>
                  It is your responsibility to review these Terms periodically. If you disagree with any updated Terms, you must stop using the platform and close your account.
                </Body>
              </div>
            </section>

            <Divider />

            {/* 14 · Contact */}
            <section id="contact">
              <div ref={s14} style={fadeStyle}>
                <SectionLabel>14 — Contact Us</SectionLabel>
                <SH>Questions about these Terms?</SH>
                <Body>
                  If you have questions, concerns, or requests related to these Terms of Service, please contact us through one of the following channels:
                </Body>
                <div style={{ background: '#F5F7FA', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="terms-inner-grid">
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Legal Enquiries</p>
                      <a href="mailto:legal@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>legal@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>General Support</p>
                      <a href="mailto:support@urbance.ca" style={{ fontSize: '15px', fontWeight: 600, color: '#2F80ED', textDecoration: 'none', fontFamily: FONT }}>support@urbance.ca</a>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Business Address</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                        Urbance Inc.<br />
                        Metro Vancouver, British Columbia<br />
                        Canada
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 6px', fontFamily: FONT }}>Response Time</p>
                      <p style={{ fontSize: '14.5px', color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>Within 30 days<br />(typically 5 business days)</p>
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
                    href="/privacy"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: '#F5F7FA', color: '#374151', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, border: '1px solid #E5E7EB' }}
                  >
                    Privacy Policy
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
            <Link href="/cookies" style={{ color: '#6B7280', textDecoration: 'none' }}>Cookie Policy</Link>
          </p>
        </div>

      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        @media (max-width: 768px) {
          .legal-layout      { grid-template-columns: 1fr !important; padding: 40px 16px 60px !important; }
          .legal-toc         { display: none !important; }
          .terms-inner-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
