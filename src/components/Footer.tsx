'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '0 24px 48px',
    }}>
      <div style={{
        maxWidth: '1160px',
        margin: '0 auto',
        backgroundColor: '#F5F7FA',
        borderRadius: '20px',
        border: '1px solid #E9EBEE',
        boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
        padding: '56px 64px',
      }}>

        {/* Top grid */}
        <div className="footer-grid" style={{ display: 'grid', gap: '48px', marginBottom: '52px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#2F80ED',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 12L7.5 3L12.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 9h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>
                Urbance <span style={{ color: '#2F80ED' }}>Pros</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, maxWidth: '220px', margin: '0 0 20px' }}>
              The professional network for home service providers in Canada.
            </p>
            <a
              href="mailto:support@urbance.ca"
              style={{ fontSize: '13px', fontWeight: 500, color: '#2F80ED', textDecoration: 'none' }}
            >
              support@urbance.ca
            </a>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '18px' }}>Platform</div>
            {[
              { label: 'How It Works',  href: '/how-it-works' },
              { label: 'Earnings',      href: '/earnings' },
              { label: 'Requirements',  href: '/requirements' },
              { label: 'Apply Now',     href: '/apply' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '11px', lineHeight: 1.4 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '18px' }}>Account</div>
            {[
              { label: 'Sign In',   href: '/login' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'My Jobs',   href: '/dashboard/jobs' },
              { label: 'Payouts',   href: '/dashboard/payouts' },
              { label: 'FAQ',       href: '/faq' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '11px', lineHeight: 1.4 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '18px' }}>Company</div>
            {([
              { label: 'Urbance Home',    href: 'https://urbance.ca', external: true },
              { label: 'Privacy Policy',  href: '/privacy',  external: false },
              { label: 'Terms of Service',href: '/terms',    external: false },
              { label: 'Cookie Policy',   href: '/cookies',  external: false },
            ] as { label: string; href: string; external: boolean }[]).map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '11px', lineHeight: 1.4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                >
                  {item.label} ↗
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '11px', lineHeight: 1.4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111111')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: '12px',
        }}>
          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
            © {new Date().getFullYear()} Urbance Technologies Inc. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid { grid-template-columns: 1.6fr 1fr 1fr 1fr; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          footer > div { padding: 40px 32px !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          footer > div { padding: 36px 24px !important; }
        }
      `}</style>
    </footer>
  );
}
