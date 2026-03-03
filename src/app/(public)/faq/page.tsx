'use client';

import { useState, useEffect, useRef } from 'react';
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
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const CATEGORIES = [
  { id: 'all',             label: 'All Questions' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'payments',        label: 'Payments & Earnings' },
  { id: 'jobs',            label: 'Jobs & Clients' },
  { id: 'account',         label: 'Account & Support' },
];

const CAT_COLOR: Record<string, { color: string; bg: string }> = {
  'getting-started': { color: '#2F80ED', bg: '#EBF3FD' },
  'payments':        { color: '#059669', bg: '#ECFDF5' },
  'jobs':            { color: '#7C3AED', bg: '#F5F3FF' },
  'account':         { color: '#D97706', bg: '#FFFBEB' },
};

const FAQS = [
  // Getting Started
  { cat: 'getting-started', q: 'How much does it cost to join?',        a: 'Joining Urbance is 100% free. There are no signup fees, monthly fees, or hidden costs. We only take a 10% commission on completed jobs — you earn, we earn. That\'s it.' },
  { cat: 'getting-started', q: 'How long does approval take?',          a: 'Most applications are reviewed within 3–5 business days. Background checks typically take 2–3 days. Once approved, you can start accepting jobs immediately.' },
  { cat: 'getting-started', q: 'What areas do you serve?',              a: 'We currently operate throughout British Columbia, with the highest demand in Metro Vancouver (Vancouver, Surrey, Burnaby, Richmond, Coquitlam, Langley, and surrounding areas). We\'re expanding to other cities soon.' },
  { cat: 'getting-started', q: 'Do I need insurance?',                  a: 'Yes, liability insurance ($2M minimum) is required for most services. If you don\'t have it yet, we can recommend affordable providers during onboarding.' },
  { cat: 'getting-started', q: 'What documents do I need to apply?',    a: 'You\'ll need a valid government-issued ID, proof of eligibility to work in Canada, relevant certifications or trade licenses, proof of insurance, and professional references.' },
  { cat: 'getting-started', q: 'Can I work for other platforms?',       a: 'Absolutely. Urbance is flexible — you\'re free to work independently or with other services. We only ask that you deliver quality work on the jobs you accept from us.' },
  // Payments
  { cat: 'payments', q: 'When do I get paid?',               a: 'Payments are processed weekly via direct deposit or e-Transfer every Friday for the prior week\'s completed jobs. Track your earnings in real-time through the dashboard.' },
  { cat: 'payments', q: 'How much can I earn?',              a: 'Earnings vary by service type and how much you work. On average, our professionals earn $3,500–$8,000 per month. Top earners make $10,000+ monthly. You set your own rates and schedule.' },
  { cat: 'payments', q: 'What is the commission rate?',      a: 'Urbance takes a 10% commission on completed jobs. This covers payment processing, insurance, customer support, marketing, and platform maintenance. There are no other fees.' },
  { cat: 'payments', q: 'Can I set my own rates?',           a: 'Yes. You have complete control over your pricing. We provide market-rate guidance to help you stay competitive, but the final decision is always yours.' },
  { cat: 'payments', q: 'Are there any hidden fees?',        a: 'No hidden fees whatsoever. The 10% commission is our only charge. No monthly subscriptions, no lead fees, no withdrawal fees.' },
  // Jobs
  { cat: 'jobs', q: 'Can I choose which jobs to accept?',          a: 'Yes. Browse available jobs, see all details (location, pay, scope), and only accept the ones that fit your schedule. No pressure to accept everything.' },
  { cat: 'jobs', q: 'How do I get more jobs?',                     a: 'Build a strong profile with a detailed bio and service descriptions. Complete jobs on time and earn 5-star reviews. Respond quickly to requests — top-rated pros get priority placement.' },
  { cat: 'jobs', q: 'What if I need to cancel a job?',             a: 'You can cancel jobs, but we ask for as much notice as possible. Frequent cancellations may affect your rating and job priority. Contact support if you\'re facing an emergency.' },
  { cat: 'jobs', q: 'Can I bring my existing clients?',            a: 'Yes. You can invite your existing clients to book through Urbance. They\'ll enjoy easy payment processing and scheduling tools, while you benefit from platform support and payment security.' },
  { cat: 'jobs', q: 'How do reviews and ratings work?',            a: 'Clients rate you 1–5 stars after job completion. Your overall rating is the average of all reviews. High ratings lead to more job opportunities and better placement in search results.' },
  // Account
  { cat: 'account', q: 'Can I pause my account temporarily?',     a: 'Yes. Set your availability to "unavailable" anytime — you won\'t receive new job requests, but can still complete scheduled jobs. Reactivate whenever you\'re ready.' },
  { cat: 'account', q: 'How do I update my services or rates?',   a: 'Log into your dashboard, go to Profile, and update your services, rates, availability, and bio anytime.' },
  { cat: 'account', q: 'What happens if I get injured on the job?', a: 'As an independent contractor, you\'re responsible for your own WCB coverage. We strongly recommend proper insurance. Contact support immediately if an incident occurs.' },
  { cat: 'account', q: 'How do I contact support?',               a: 'Email support@urbance.ca or open a ticket directly in your dashboard. We aim to respond within 24 hours on weekdays, faster for urgent issues.' },
  { cat: 'account', q: 'Can I delete my account?',                a: 'Yes, you can delete your account anytime from Account Settings. Complete all scheduled jobs and ensure there are no pending payments first. Deletion is permanent.' },
];

function AccordionItem({ q, a, cat, defaultOpen }: { q: string; a: string; cat: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const cc = CAT_COLOR[cat] ?? CAT_COLOR['getting-started'];
  return (
    <div
      style={{ background: '#FFF', borderRadius: '14px', border: `1px solid ${open ? cc.color + '33' : '#F3F4F6'}`, overflow: 'hidden', transition: 'border-color 0.18s', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter',-apple-system,sans-serif" }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cc.color, flexShrink: 0, marginTop: '1px' }} />
        <span style={{ flex: 1, fontSize: '15px', fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{q}</span>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: open ? cc.bg : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.18s' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M2 4l4 4 4-4" stroke={open ? cc.color : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px 48px' }}>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#6B7280', lineHeight: 1.75 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const heroRef    = useFadeIn();
  const filterRef  = useFadeIn();
  const listRef    = useFadeIn();
  const ctaRef     = useFadeIn();

  const filtered = FAQS.filter(f => {
    const byCategory = activeCategory === 'all' || f.cat === activeCategory;
    const bySearch   = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return byCategory && bySearch;
  });

  return (
    <>
      <Navbar />

      <main style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color: '#111', background: '#fff' }}>

        {/* ── HERO ── */}
        <section style={{ padding: '160px 24px 100px', position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
          <img
            src="/images/ChatGPT Image Feb 27, 2026, 12_38_33 PM.png"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0, pointerEvents: 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.54)', zIndex: 1, pointerEvents: 'none' }} />

          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div ref={heroRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 20px' }}>FAQ</p>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 20px', lineHeight: 1.08 }}>
                Frequently asked<br />questions
              </h1>
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.75, margin: '0 auto 40px', maxWidth: '520px' }}>
                Everything you need to know about joining and working with Urbance Pros.
              </p>
              {/* Search */}
              <div style={{ position: 'relative', maxWidth: '460px', margin: '0 auto' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '14px 18px 14px 44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)', fontSize: '15px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY FILTER + FAQ LIST ── */}
        <section style={{ padding: '72px 24px 80px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>

            {/* Filter pills */}
            <div ref={filterRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease', display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px', justifyContent: 'center' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  style={{
                    padding: '8px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                    background: activeCategory === c.id ? '#111' : '#FFF',
                    color:      activeCategory === c.id ? '#FFF' : '#6B7280',
                    boxShadow:  activeCategory === c.id ? '0 2px 8px rgba(17,17,17,0.18)' : '0 1px 3px rgba(17,17,17,0.06)',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Count */}
            <div style={{ fontSize: '12.5px', color: '#9CA3AF', marginBottom: '16px', fontWeight: 500 }}>
              {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
              {search && <span> matching &ldquo;{search}&rdquo;</span>}
            </div>

            {/* Accordion list */}
            <div ref={listRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.length === 0 ? (
                <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '56px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>No results found</div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Try different keywords or browse all questions.</div>
                  <button onClick={() => { setSearch(''); setActiveCategory('all'); }} style={{ marginTop: '16px', padding: '9px 20px', borderRadius: '9px', border: 'none', background: '#EBF3FD', color: '#2F80ED', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear filters
                  </button>
                </div>
              ) : (
                filtered.map((f, i) => (
                  <AccordionItem key={i} q={f.q} a={f.a} cat={f.cat} defaultOpen={i === 0 && activeCategory !== 'all'} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { v: '10%',       label: 'Platform fee only', sub: 'No hidden costs' },
              { v: '3–5 days',  label: 'Approval time',     sub: 'Fast review process' },
              { v: '$6,200',    label: 'Average earnings',   sub: 'Per month for active pros' },
              { v: '24 hrs',    label: 'Support response',   sub: 'On weekdays' },
            ].map(s => (
              <div key={s.v}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#111', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginTop: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STILL HAVE QUESTIONS CTA ── */}
        <section style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              ref={ctaRef}
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E5E7EB', padding: '56px 48px', textAlign: 'center' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EBF3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>💬</div>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em', margin: '0 0 10px' }}>Still have questions?</h2>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 32px' }}>
                Our team is happy to help. Reach out by email and we&apos;ll respond within 24 hours.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="mailto:support@urbance.ca"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#2F80ED', color: '#FFF', fontSize: '14.5px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 18px rgba(47,128,237,0.28)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                  Email Support
                </a>
                <Link
                  href="/apply"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#F3F4F6', color: '#111', fontSize: '14.5px', fontWeight: 600, textDecoration: 'none' }}
                >
                  Apply Now
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

