import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Force dynamic rendering - never prerender protected pages
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return <>{children}</>;
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Admins bypass all application checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // Check application status for providers
  const { data: app } = await supabase
    .from('provider_applications')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle();

  const status = app?.status;

  // No application or draft → must complete application first
  if (!status || status === 'draft') {
    redirect('/apply?message=complete-application');
  }

  // Rejected
  if (status === 'rejected') {
    redirect('/apply?message=application-rejected');
  }

  // Submitted / under review → show gated waiting screen
  if (status === 'submitted' || status === 'under_review') {
    return (
      <>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F0F6FF,#F5F0FF,#F0FFF8)', fontFamily: "'Inter',-apple-system,sans-serif", padding: '40px 24px' }}>
          <div className="review-card" style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #EEEFF1', padding: '56px 48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>⏳</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111111', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Application Under Review</h1>
            <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 28px' }}>
              Your application has been received and is currently being reviewed by our team. You&apos;ll receive an email notification once approved — typically within 3–5 business days.
            </p>
            <div style={{ backgroundColor: '#F8F9FC', borderRadius: '12px', padding: '18px', marginBottom: '28px' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Status: <strong style={{ color: '#D97706' }}>Under Review</strong>
              </p>
            </div>
            <a href="/" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: '12px', backgroundColor: '#111111', color: '#ffffff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              Back to Home
            </a>
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) {
            .review-card { padding: 36px 20px !important; border-radius: 16px !important; }
          }
        `}</style>
      </>
    );
  }

  // Approved — full dashboard access
  return <>{children}</>;
}
