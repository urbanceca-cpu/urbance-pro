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
  { cat: 'getting-started', q: 'Is there a cost to join Urbance?',      a: 'Joining Urbance is completely free. There are no signup fees or monthly subscriptions. Urbance operates on a simple 7% service commission on completed jobs, which helps support the platform, customer acquisition, and payment processing.' },
  { cat: 'getting-started', q: 'How long does the approval process take?', a: 'Most applications are reviewed within 3–5 business days. Once your profile is approved, you can start accepting jobs and receiving bookings through the platform.' },
  { cat: 'getting-started', q: 'Which locations does Urbance currently serve?', a: 'Urbance currently operates across British Columbia, with strong demand throughout Metro Vancouver, including Vancouver, Surrey, Burnaby, Richmond, Coquitlam, and Langley. We are gradually expanding to additional cities.' },
  { cat: 'getting-started', q: 'Is insurance required to work on the platform?', a: 'Many professional services benefit from having liability insurance as part of standard business practice. During onboarding, professionals can provide their existing coverage details if applicable.' },
  { cat: 'getting-started', q: 'What documents are needed to apply?',   a: 'To create a professional profile, you may be asked to provide: government-issued ID, proof of eligibility to work in Canada, relevant certifications or trade licenses (if applicable), and business or professional information. These help maintain a trusted and professional platform for customers.' },
  { cat: 'getting-started', q: 'Can I work independently or with other platforms?', a: 'Yes. Urbance professionals are independent service providers and are free to manage their work however they choose. Many professionals use Urbance alongside their own client base or other opportunities.' },
  // Payments
  { cat: 'payments', q: 'When are payments processed?',             a: 'Payments for completed jobs are processed weekly, typically every Friday for the previous week\'s work. Your dashboard allows you to track upcoming payments and job earnings.' },
  { cat: 'payments', q: 'How does Urbance\'s platform commission work?', a: 'Urbance applies a 7% commission on completed jobs, which is lower than many service marketplaces. This helps support platform operations, booking tools, payment processing, and customer support.' },
  { cat: 'payments', q: 'Are there additional platform fees?',       a: 'Urbance keeps things simple with a single 7% commission on completed jobs. There are no subscriptions or recurring platform fees.' },
  // Jobs
  { cat: 'jobs', q: 'Can I choose which jobs I accept?',              a: 'Yes. Professionals can review job details and accept bookings that fit their schedule and service preferences.' },
  { cat: 'jobs', q: 'How can professionals increase their bookings?', a: 'A strong profile, reliable service, and positive customer reviews help professionals receive more visibility on the platform. Completing jobs consistently and maintaining a great customer experience helps build a strong reputation.' },
  { cat: 'jobs', q: 'What if my availability changes?',               a: 'Professionals can update their availability anytime through their dashboard, making it easy to manage schedules and upcoming bookings.' },
  { cat: 'jobs', q: 'Can I invite my existing clients to use Urbance?', a: 'Yes. Professionals can invite their existing clients to book through Urbance, allowing them to benefit from streamlined scheduling and payment processing.' },
  { cat: 'jobs', q: 'How do customer ratings work?',                  a: 'After each completed service, customers may leave a rating and review. These help other customers make informed decisions and highlight professionals who consistently deliver great service.' },
  // Account
  { cat: 'account', q: 'Can I temporarily pause my availability?',    a: 'Yes. Professionals can update their availability at any time from their dashboard if they wish to take a break or adjust their schedule.' },
  { cat: 'account', q: 'How do I update my services or pricing?',     a: 'You can update your services, pricing, and availability anytime through your professional dashboard.' },
  { cat: 'account', q: 'How can I contact the Urbance team?',         a: 'You can reach the Urbance team by emailing support@urbance.ca or by submitting a request through your dashboard.' },
  { cat: 'account', q: 'Can I close my account if needed?',           a: 'If you ever decide to stop using the platform, account settings allow you to manage or close your profile after completing any active bookings.' },
];

function AccordionItem({ q, a, cat, defaultOpen }: { q: string; a: string; cat: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const cc = CAT_COLOR[cat] ?? CAT_COLOR['getting-started'];
  return (
    <div
      style={{ background: '#FFF', borderRadius: '14px', border: `1px solid ${open ? cc.color + '33' : '#F3F4F6'}`, overflow: 'hidden', transition: 'border-color 0.18s', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}
    >
      <button
        className="faq-accordion-btn"
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
        <div className="faq-accordion-answer" style={{ padding: '0 24px 20px 48px' }}>
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
        <section className="faq-hero-section" style={{ padding: '160px 24px 100px', position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
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
                  className="faq-search-input"
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
        <section className="faq-list-section" style={{ padding: '72px 24px 80px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>

            {/* Filter pills */}
            <div ref={filterRef} className="faq-filter-row" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease', display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px', justifyContent: 'center' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className="faq-filter-btn"
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
        <section className="faq-stats-strip" style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }} className="faq-stats-grid">
            {[
              { v: '7%',       label: 'Platform fee only', sub: 'No hidden costs' },
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
        <section className="faq-cta-section" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              ref={ctaRef}
              className="faq-cta-card"
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E5E7EB', padding: '56px 48px', textAlign: 'center' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EBF3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>💬</div>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em', margin: '0 0 10px' }}>Still have questions?</h2>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 32px' }}>
                Our team is happy to help. Reach out by email and we&apos;ll respond within 24 hours.
              </p>
              <div className="faq-cta-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }

        @media (max-width: 640px) {
          /* Hero */
          .faq-hero-section { padding: 110px 16px 64px !important; }
          .faq-search-input { font-size: 16px !important; } /* Prevent iOS zoom */

          /* Filter pills — horizontal scroll */
          .faq-filter-row {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            justify-content: flex-start !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px !important;
            scrollbar-width: none;
          }
          .faq-filter-row::-webkit-scrollbar { display: none; }
          .faq-filter-btn { white-space: nowrap !important; flex-shrink: 0 !important; }

          /* FAQ list section */
          .faq-list-section { padding: 48px 16px 64px !important; }

          /* Accordion items */
          .faq-accordion-btn { padding: 16px 16px !important; }
          .faq-accordion-answer { padding: 0 16px 16px 36px !important; }

          /* Stats strip */
          .faq-stats-strip { padding: 48px 16px !important; }
          .faq-stats-grid  { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }

          /* CTA section */
          .faq-cta-section { padding: 56px 16px !important; }
          .faq-cta-card    { padding: 36px 24px !important; border-radius: 18px !important; }
          .faq-cta-btns    { flex-direction: column !important; gap: 10px !important; }
          .faq-cta-btns a  { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}

