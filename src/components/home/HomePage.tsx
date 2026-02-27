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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function HomePage() {
  const heroRef = useFadeIn();
  const valuesRef = useFadeIn();
  const howRef = useFadeIn();
  const earningsRef = useFadeIn();
  const partnersRef = useFadeIn();
  const applyRef = useFadeIn();

  return (
    <>
    <Navbar />
    <main style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#111111', backgroundColor: '#ffffff' }}>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'grid', gap: '80px', alignItems: 'center' }}>
            <div ref={heroRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#EBF3FD', color: '#2F80ED', fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', padding: '6px 14px', borderRadius: '100px', marginBottom: '32px', textTransform: 'uppercase' as const }}>
                Now Accepting Applications · BC
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', color: '#111111', margin: '0 0 24px 0' }}>
                Build a stronger service business with Urbance.
              </h1>
              <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#6B7280', margin: '0 0 48px 0', maxWidth: '480px' }}>
                We connect trusted professionals with high-quality clients across British Columbia.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
                <Link href="/apply" style={{ display: 'inline-block', backgroundColor: '#2F80ED', color: '#ffffff', fontSize: '15px', fontWeight: 600, padding: '14px 28px', borderRadius: '8px', textDecoration: 'none' }}>
                  Apply to Join
                </Link>
                <a href="#how-it-works" style={{ display: 'inline-block', color: '#111111', fontSize: '15px', fontWeight: 500, padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', border: '1px solid #E5E7EB' }}>
                  See How It Works
                </a>
              </div>
            </div>
            <div className="hero-image" style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5', backgroundColor: '#F5F7FA' }}>
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=85&fit=crop"
                alt="Professional service provider"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section style={{ backgroundColor: '#F5F7FA', padding: '20px 24px' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', letterSpacing: '0.04em', margin: 0, textAlign: 'center' }}>
          SERVING&nbsp;&nbsp;Vancouver &bull; Burnaby &bull; Surrey &bull; Richmond &bull; Coquitlam
        </p>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section style={{ padding: '120px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={valuesRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Why Urbance</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111111', marginBottom: '64px', maxWidth: '500px', lineHeight: 1.2 }}>
              Everything you need to grow.
            </h2>
            <div className="value-grid" style={{ display: 'grid', gap: '24px' }}>
              {[
                { n: '01', title: 'Earn Predictable Income', body: 'Qualified customers. No bidding wars. We bring the jobs to you.' },
                { n: '02', title: 'Focus on Your Craft', body: 'We handle scheduling, support, and payments end-to-end.' },
                { n: '03', title: 'Get Paid Securely', body: 'Transparent commission. Weekly direct payouts. No surprises.' },
              ].map((c) => (
                <div key={c.n} style={{ backgroundColor: '#ffffff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '40px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', marginBottom: '20px', letterSpacing: '0.04em' }}>{c.n}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111111', marginBottom: '12px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{c.title}</h3>
                  <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '120px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={howRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Process</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111111', marginBottom: '72px', lineHeight: 1.2 }}>How it works.</h2>
            <div className="steps-grid" style={{ display: 'grid', gap: '0' }}>
              {[
                { n: '01', title: 'Apply', desc: 'Submit your application online in minutes.' },
                { n: '02', title: 'Get Verified', desc: 'We review credentials and background.' },
                { n: '03', title: 'Receive Jobs', desc: 'Matched leads arrive in your dashboard.' },
                { n: '04', title: 'Complete Work', desc: 'Deliver quality work to the client.' },
                { n: '05', title: 'Get Paid', desc: 'Funds deposited weekly, no delays.' },
              ].map((s, i) => (
                <div key={s.n} className="step-item" style={{ paddingRight: '24px', borderLeft: i === 0 ? 'none' : '1px solid #F0F0F0', paddingLeft: i === 0 ? 0 : '24px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#E5E7EB', marginBottom: '16px', letterSpacing: '-0.02em' }}>{s.n}</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#111111', marginBottom: '8px' }}>{s.title}</div>
                  <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EARNINGS */}
      <section id="earnings" style={{ padding: '120px 24px', backgroundColor: '#F5F7FA' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' as const }}>
          <div ref={earningsRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Compensation</p>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111111', marginBottom: '16px', lineHeight: 1.2 }}>Transparent by design.</h2>
            <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.7, marginBottom: '64px' }}>No hidden fees. No subscriptions. No pay-per-lead traps.</p>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', textAlign: 'left' as const }}>
              {[
                { label: 'Commission Rate', value: '5–7%', note: 'Scaling to 12% with volume' },
                { label: 'Subscription Fee', value: '$0', note: 'No monthly charges' },
                { label: 'Lead Buying', value: 'None', note: 'We send jobs to you' },
                { label: 'Payment Security', value: '100%', note: 'All transactions secured' },
                { label: 'Payout Schedule', value: 'Weekly', note: 'Direct bank deposit' },
              ].map((row, i) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderTop: i === 0 ? 'none' : '1px solid #F5F7FA' }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>{row.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: '#111111' }}>{row.value}</span>
                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{row.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTIVE PARTNERS */}
      <section id="requirements" style={{ padding: '120px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={partnersRef} className="partners-grid" style={{ display: 'grid', gap: '80px', alignItems: 'center', opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Standards</p>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111111', marginBottom: '24px', lineHeight: 1.2 }}>We partner with serious professionals.</h2>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7, margin: 0 }}>Urbance is selective. We maintain a high standard so every customer experience reflects the quality of our network.</p>
            </div>
            <div>
              {[
                'Licensed where required by law',
                'Insured with valid coverage',
                '2+ years of professional experience',
                'Clear and professional communication',
                'Commitment to quality on every job',
              ].map((req) => (
                <div key={req} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: '1px solid #F5F7FA' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EBF3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: '15px', color: '#374151' }}>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION PREVIEW */}
      <section style={{ padding: '120px 24px', backgroundColor: '#F5F7FA' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div ref={applyRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px', textAlign: 'center' as const }}>Join Urbance</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#111111', marginBottom: '12px', textAlign: 'center' as const, lineHeight: 1.2 }}>Start your application.</h2>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '48px', textAlign: 'center' as const, lineHeight: 1.6 }}>Takes less than 5 minutes. No commitment required.</p>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '40px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
                  { label: 'Company Name', placeholder: 'Smith Services Inc.', type: 'text' },
                  { label: 'Years of Experience', placeholder: '5', type: 'number' },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '15px', color: '#111111', backgroundColor: '#FAFAFA', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }} />
                  </div>
                ))}
                {[
                  { label: 'Service Type', opts: ['Cleaning', 'Plumbing', 'Electrical', 'HVAC', 'Landscaping', 'Painting', 'Handyman', 'Moving'] },
                  { label: 'Service Area', opts: ['Vancouver', 'Burnaby', 'Surrey', 'Richmond', 'Coquitlam'] },
                ].map((sel) => (
                  <div key={sel.label}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{sel.label}</label>
                    <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '15px', color: '#111111', backgroundColor: '#FAFAFA', outline: 'none', fontFamily: 'inherit' }}>
                      <option value="">Select…</option>
                      {sel.opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <Link href="/apply" style={{ display: 'block', width: '100%', backgroundColor: '#2F80ED', color: '#ffffff', fontSize: '15px', fontWeight: 600, padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' as const, marginTop: '24px', boxSizing: 'border-box' as const }}>
                Continue Application →
              </Link>
              <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center' as const, marginTop: '16px', marginBottom: 0 }}>Your information is kept private and secure.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .hero-grid { grid-template-columns: 1fr 1fr; }
        .value-grid { grid-template-columns: repeat(3, 1fr); }
        .steps-grid { grid-template-columns: repeat(5, 1fr); }
        .partners-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image { display: none; }
          .value-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .step-item { border-left: none !important; padding-left: 0 !important; border-top: 1px solid #F0F0F0; padding-top: 24px !important; }
          .partners-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
    <Footer />
    </>
  );
}
