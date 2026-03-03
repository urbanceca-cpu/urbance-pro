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
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const coreReqs = [
  {
    n: '01',
    color: '#2F80ED',
    light: '#EBF3FD',
    icon: '🪪',
    title: 'Licensed Where Required',
    body: 'Certain trades in British Columbia require a valid provincial licence to operate. If your trade requires one, you must hold a current, valid licence before approval.',
    tags: ['Trade licence', 'BC regulated trades'],
  },
  {
    n: '02',
    color: '#7C3AED',
    light: '#F5F3FF',
    icon: '🛡️',
    title: 'Liability Insurance',
    body: 'A minimum of $2M in commercial general liability insurance is required — protecting you and your clients against property damage or injury during any job.',
    tags: ['$2M minimum', 'Commercial GL'],
  },
  {
    n: '03',
    color: '#059669',
    light: '#ECFDF5',
    icon: '🔧',
    title: '2+ Years Experience',
    body: 'We require a minimum of two years of paid, professional experience in your trade. Urbance is built for skilled professionals — not a platform for beginners.',
    tags: ['Verified experience', 'Reference check'],
  },
  {
    n: '04',
    color: '#D97706',
    light: '#FFFBEB',
    icon: '💬',
    title: 'Professional Communication',
    body: 'Responding promptly, communicating clearly on scope and scheduling, and maintaining professionalism in every interaction is a baseline expectation.',
    tags: ['Responsive', 'Clear scope'],
  },
  {
    n: '05',
    color: '#0891B2',
    light: '#ECFEFF',
    icon: '⭐',
    title: 'Consistent Quality',
    body: 'Show up on time, complete work to the agreed standard, and leave a clean worksite. Every job reflects the Urbance network — your reputation is ours too.',
    tags: ['On-time delivery', 'Clean worksite'],
  },
  {
    n: '06',
    color: '#DB2777',
    light: '#FDF2F8',
    icon: '✅',
    title: 'Background Check',
    body: 'All applicants consent to and must pass a criminal background check. This is a standard requirement across all trades and service categories.',
    tags: ['Criminal record check', 'Required for all'],
  },
];

const docRequirements = [
  { category: 'Identity', items: ['Government-issued photo ID', 'Proof of address (utility bill or bank statement)'], color: '#2F80ED', light: '#EBF3FD' },
  { category: 'Credentials', items: ['Trade licence (if applicable)', 'Certificates of completion or training', 'Reference letters (optional but helpful)'], color: '#7C3AED', light: '#F5F3FF' },
  { category: 'Insurance', items: ['Certificate of insurance (COI)', 'Policy number and provider name', 'Expiry date must be current'], color: '#059669', light: '#ECFDF5' },
  { category: 'Business', items: ['Business name or sole proprietor info', 'GST/HST number if registered', 'Service area and availability'], color: '#D97706', light: '#FFFBEB' },
];

export default function Requirements() {
  const heroRef    = useFadeIn();
  const whyRef     = useFadeIn();
  const reqRef     = useFadeIn();
  const docsRef    = useFadeIn();
  const ctaRef     = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#111111',
        backgroundColor: '#ffffff',
      }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="req-hero-section" style={{
          padding: '160px 24px 120px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
        }}>
          {/* Background image */}
          <img
            src="/images/ChatGPT Image Feb 27, 2026, 01_18_11 PM.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              zIndex: 0, pointerEvents: 'none',
            }}
          />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1, pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div ref={heroRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="req-hero-grid">
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Standards</p>
                  <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 24px', lineHeight: 1.08 }}>
                    We partner with<br />serious professionals.
                  </h1>
                  <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.8, margin: '0 0 48px', maxWidth: '420px' }}>
                    Urbance is selective by design. Our bar is high because our clients expect the best — and the best professionals deserve a network that reflects that.
                  </p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
                    <Link href="/apply" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      backgroundColor: '#2F80ED', color: '#ffffff',
                      fontSize: '15px', fontWeight: 600, padding: '15px 32px',
                      borderRadius: '10px', textDecoration: 'none',
                      boxShadow: '0 8px 28px rgba(47,128,237,0.4)',
                    }}>
                      Apply Now
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                    <Link href="/how-it-works" style={{
                      display: 'inline-block', color: 'rgba(255,255,255,0.75)',
                      fontSize: '15px', fontWeight: 500, padding: '15px 32px',
                      borderRadius: '10px', textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.18)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}>
                      How It Works
                    </Link>
                  </div>
                </div>

                {/* Right — requirement chips */}
                <div className="req-hero-chips" style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                  {coreReqs.map((r) => (
                    <div key={r.n} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      backgroundColor: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '12px', padding: '14px 18px',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        backgroundColor: r.light, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                      }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{r.title}</div>
                      </div>
                      <div style={{
                        backgroundColor: r.light, color: r.color,
                        fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                        borderRadius: '100px', whiteSpace: 'nowrap' as const, flexShrink: 0,
                      }}>{r.n}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── WHY THE BAR IS HIGH ──────────────────────────────── */}
        <section className="req-why-section" style={{ padding: '120px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={whyRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="req-2col-grid">
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Our Philosophy</p>
                  <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: '0 0 20px', lineHeight: 1.15 }}>
                    High standards protect<br />everyone in the network.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 36px' }}>
                    When every professional in our network meets the same bar, the whole ecosystem wins. Clients trust faster. Jobs close faster. Disputes are rare. Repeat work is the norm.
                  </p>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: 0 }}>
                    We are not trying to be the biggest platform. We are building the most trusted one — and that starts with who we let in.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { stat: '100%', label: 'Background checked', color: '#2F80ED', light: '#EBF3FD' },
                    { stat: '100%', label: 'Insurance verified', color: '#059669', light: '#ECFDF5' },
                    { stat: '2+ yrs', label: 'Minimum experience', color: '#7C3AED', light: '#F5F3FF' },
                    { stat: 'Active', label: 'Licence monitoring', color: '#D97706', light: '#FFFBEB' },
                  ].map((s) => (
                    <div key={s.label} style={{
                      backgroundColor: s.light, borderRadius: '16px',
                      padding: '28px 24px', border: `1px solid ${s.color}22`,
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', marginBottom: '6px' }}>{s.stat}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE REQUIREMENTS ────────────────────────────────── */}
        <section style={{ padding: '120px 24px', backgroundColor: '#F8F9FC', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={reqRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div style={{ textAlign: 'center' as const, marginBottom: '72px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>Requirements</p>
                <h2 style={{ fontSize: 'clamp(30px, 3vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: 0, lineHeight: 1.12 }}>
                  What we look for in every applicant.
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="req-core-grid">
                {coreReqs.map((r) => (
                  <div key={r.n} style={{
                    backgroundColor: '#ffffff', borderRadius: '18px',
                    border: '1px solid #EEEFF1', padding: '36px 28px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
                    borderTop: `3px solid ${r.color}`,
                    display: 'flex', flexDirection: 'column' as const, gap: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        backgroundColor: r.light, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                      }}>{r.icon}</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: r.color, letterSpacing: '0.06em' }}>{r.n}</div>
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1.3 }}>{r.title}</h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{r.body}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginTop: 'auto' }}>
                      {r.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: '11px', fontWeight: 600, color: r.color,
                          backgroundColor: r.light, padding: '4px 10px',
                          borderRadius: '100px',
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── DOCUMENTS NEEDED ─────────────────────────────────── */}
        <section style={{ padding: '120px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={docsRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="req-2col-grid">
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Documents</p>
                  <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: '0 0 20px', lineHeight: 1.15 }}>
                    What to have ready<br />before you apply.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 36px' }}>
                    Gathering your documents ahead of time makes the application fast and smooth. Most applicants complete it in under 10 minutes when prepared.
                  </p>
                  <div style={{
                    backgroundColor: '#EBF3FD', borderRadius: '14px',
                    padding: '20px 24px', border: '1px solid #BFDBFE',
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>Pro tip</div>
                      <div style={{ fontSize: '14px', color: '#3B82F6', lineHeight: 1.6 }}>Have digital copies (PDF or photo) of all documents ready before starting. You can save and return to the application at any time.</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  {docRequirements.map((doc) => (
                    <div key={doc.category} style={{
                      backgroundColor: '#ffffff', borderRadius: '16px',
                      border: '1px solid #EEEFF1', overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                    }}>
                      <div style={{
                        padding: '14px 24px', backgroundColor: doc.light,
                        borderBottom: `1px solid ${doc.color}22`,
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: doc.color }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: doc.color }}>{doc.category}</span>
                      </div>
                      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                        {doc.items.map((item) => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              backgroundColor: doc.light, display: 'flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4l2 2 3-3" stroke={doc.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAT STRIP ───────────────────────────────────────── */}
        <section style={{ padding: '0 24px 120px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#EEEFF1', borderRadius: '20px', overflow: 'hidden' }} className="req-stat-strip">
              {[
                { stat: '< 1 week',  label: 'Average approval time',  sub: 'From application to active status' },
                { stat: '< 10 min',  label: 'Application length',     sub: 'If your documents are ready to go' },
                { stat: 'Selective', label: 'We screen every applicant', sub: 'Not everyone is accepted — quality matters' },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: '#ffffff', padding: '48px 40px' }}>
                  <div style={{ fontSize: '34px', fontWeight: 800, color: '#111111', letterSpacing: '-0.035em', marginBottom: '8px' }}>{item.stat}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="req-cta-section" style={{
          padding: '140px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(47,128,237,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' as const, position: 'relative' as const, zIndex: 1 }}>
            <div ref={ctaRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Ready to Apply?</p>
              <h2 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 20px', lineHeight: 1.1 }}>
                Think you meet<br />the bar?
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', margin: '0 0 52px', lineHeight: 1.75 }}>
                We review every application personally. If you qualify, you will hear back within a week.
              </p>
              <Link href="/apply" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#2F80ED', color: '#ffffff',
                fontSize: '16px', fontWeight: 600, padding: '18px 44px',
                borderRadius: '12px', textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(47,128,237,0.45)',
              }}>
                Start Your Application
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: '20px 0 0' }}>
                Takes less than 10 minutes · Free to apply
              </p>
            </div>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          h1, h2, h3, p { margin: 0; }

          @media (max-width: 640px) {
            .req-hero-section  { padding: 110px 16px 64px !important; }
            .req-hero-grid     { grid-template-columns: 1fr !important; gap: 32px !important; }
            .req-hero-chips    { display: none !important; }
            .req-why-section   { padding: 64px 16px !important; }
            .req-2col-grid     { grid-template-columns: 1fr !important; gap: 32px !important; }
            .req-core-grid     { grid-template-columns: 1fr !important; gap: 16px !important; }
            .req-stat-strip    { grid-template-columns: 1fr !important; }
            .req-cta-section   { padding: 80px 16px !important; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
