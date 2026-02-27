import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ fontFamily: "'Inter', -apple-system, sans-serif", padding: '0 24px 40px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#F5F7FA',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        padding: '48px 56px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#2F80ED', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 11L7 3L12 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 8h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>Urbance <span style={{ color: '#2F80ED' }}>Pros</span></span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.7', maxWidth: '220px' }}>
              The professional network for home service providers in Canada.
            </p>
            <a href="mailto:support@urbance.ca" style={{ display: 'inline-block', marginTop: '16px', fontSize: '13px', fontWeight: 500, color: '#2F80ED', textDecoration: 'none' }}>
              support@urbance.ca
            </a>
          </div>

          {/* Platform Column */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Platform</div>
            {[
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Earnings', href: '/#earnings' },
              { label: 'Requirements', href: '/#requirements' },
              { label: 'Apply Now', href: '/apply' },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4' }}>
                {item.label}
              </a>
            ))}
          </div>

          {/* Account Column */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Account</div>
            {[
              { label: 'Sign In', href: '/login' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'My Jobs', href: '/dashboard/jobs' },
              { label: 'Payouts', href: '/dashboard/payouts' },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4' }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Company Column */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Company</div>
            {[
              { label: 'Urbance Home', href: 'https://urbance.ca', external: true },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map((item) => (
              item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4' }}>
                  {item.label} ↗
                </a>
              ) : (
                <Link key={item.label} href={item.href} style={{ display: 'block', fontSize: '14px', color: '#374151', textDecoration: 'none', marginBottom: '10px', lineHeight: '1.4' }}>
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>© {new Date().getFullYear()} Urbance Technologies Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          footer > div {
            padding: 32px 24px !important;
          }
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
          footer > div > div:last-child {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </footer>
  );
}
