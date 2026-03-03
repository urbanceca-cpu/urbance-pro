'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { toast } from 'sonner';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '820px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
  label:   { fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' },
  input:   { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13.5px', color: '#111', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter',-apple-system,sans-serif", background: '#FAFAFA', transition: 'border-color 0.15s' },
  btnPri:  { padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: '#111', color: '#FFFFFF', fontFamily: 'inherit' },
  btnSec:  { padding: '9px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, background: '#fff', color: '#374151', fontFamily: 'inherit' },
};

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SERVICE_CATS = ['Cleaning','Plumbing','Electrical','HVAC','Landscaping','Handyman','Moving','Painting','Roofing','Other'];
const BC_CITIES = ['Vancouver','Burnaby','Richmond','Surrey','Coquitlam','Langley','Abbotsford','Kelowna','Victoria','Kamloops','Prince George','Nanaimo','Chilliwack'];

const TABS = ['Basic Info','Services & Areas','Experience','Availability'];

export default function ProfilePage() {
  const [appData, setAppData]   = useState<Record<string, unknown> | null>(null);
  const [user, setUser]         = useState<{ id: string; email?: string } | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab]           = useState(0);

  // Form state
  const [basic, setBasic]   = useState({ full_legal_name: '', business_name: '', phone: '', city: '', address: '', postal_code: '' });
  const [services, setServices] = useState({ category: '', sub_services: [] as string[], service_areas: [] as string[], vehicle: '' });
  const [experience, setExp]    = useState({ years_experience: '', bio: '', team_size: '', is_licensed: false, is_insured: false });
  const [availability, setAvail] = useState({ days: [] as string[], start_time: '08:00', end_time: '18:00', available: true });

  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data } = await supabase.from('provider_applications').select('*').eq('user_id', u.id).maybeSingle();
      setAppData(data);
      if (data) {
        const bi = (data.basic_info as Record<string, string>) || {};
        const sc = (data.services_coverage as Record<string, unknown>) || {};
        const ex = (data.experience_standards as Record<string, unknown>) || {};
        const pa = (data.pricing_availability as Record<string, unknown>) || {};
        setBasic({ full_legal_name: bi.full_legal_name||'', business_name: bi.business_name||'', phone: bi.phone||'', city: bi.city||'', address: bi.address||'', postal_code: bi.postal_code||'' });
        setServices({ category: (sc.service_category as string)||'', sub_services: (sc.sub_services as string[])||[], service_areas: (sc.service_areas as string[])||[], vehicle: (sc.vehicle as string)||'' });
        setExp({ years_experience: String(ex.years_experience||''), bio: (ex.bio as string)||'', team_size: String(ex.team_size||''), is_licensed: !!(ex.is_licensed), is_insured: !!(ex.is_insured) });
        setAvail({ days: (pa.days as string[])||[], start_time: (pa.start_time as string)||'08:00', end_time: (pa.end_time as string)||'18:00', available: pa.available !== false });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase.from('provider_applications').update({
      basic_info: basic,
      services_coverage: services,
      experience_standards: { ...experience, years_experience: Number(experience.years_experience)||0, team_size: Number(experience.team_size)||1 },
      pricing_availability: availability,
    }).eq('user_id', user.id);
    if (error) { toast.error('Failed to save: ' + error.message); }
    else { toast.success('Profile saved successfully'); }
    setIsSaving(false);
  };

  const toggleDay = (day: string) => setAvail(p => ({ ...p, days: p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day] }));
  const toggleArea = (area: string) => setServices(p => ({ ...p, service_areas: p.service_areas.includes(area) ? p.service_areas.filter(a => a !== area) : [...p.service_areas, area] }));
  const toggleSub = (sub: string) => setServices(p => ({ ...p, sub_services: p.sub_services.includes(sub) ? p.sub_services.filter(s => s !== sub) : [...p.sub_services, sub] }));

  if (isLoading) return (
    <div style={S.shell}><DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', animation: 'spin 0.7s linear infinite' }} />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const bi = (appData?.basic_info as Record<string, string>) || {};
  const name = bi.full_legal_name || user?.email?.split('@')[0] || 'Provider';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Profile</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Manage all your information</div>
          </div>
          <button style={{ ...S.btnPri, opacity: isSaving ? 0.7 : 1 }} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : '💾 Save All Changes'}
          </button>
        </div>

        <div style={S.content}>
          {/* Avatar strip */}
          <div style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '17px', flexShrink: 0 }}>{initials}</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>{name}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{user?.email}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontWeight: 600 }}>
              {(appData?.status as string)||'draft'}
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#F1F5F9', borderRadius: '10px', padding: '4px' }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{
                flex: 1, padding: '8px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: tab === i ? 700 : 500,
                background: tab === i ? '#FFFFFF' : 'transparent', color: tab === i ? '#111' : '#64748B',
                boxShadow: tab === i ? '0 1px 3px rgba(15,23,42,0.08)' : 'none', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>

          {/* Tab 0: Basic Info */}
          {tab === 0 && (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Basic Information</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Your personal and contact details</div>
              </div>
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                {[
                  { key: 'full_legal_name', label: 'Full Legal Name',  placeholder: 'John Smith' },
                  { key: 'business_name',   label: 'Business Name',    placeholder: 'Smith Services (optional)' },
                  { key: 'phone',           label: 'Phone Number',     placeholder: '+1 (604) 555-0000' },
                  { key: 'city',            label: 'City',             placeholder: 'Vancouver' },
                  { key: 'address',         label: 'Street Address',   placeholder: '123 Main St' },
                  { key: 'postal_code',     label: 'Postal Code',      placeholder: 'V6B 1A1' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={S.label}>{f.label}</label>
                    <input style={S.input} placeholder={f.placeholder} value={basic[f.key as keyof typeof basic]}
                      onChange={e => setBasic(p => ({ ...p, [f.key]: e.target.value }))}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#3B82F6'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E2E8F0'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Services & Areas */}
          {tab === 1 && (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Services & Coverage Areas</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>What you offer and where</div>
              </div>
              <div style={{ padding: '24px' }}>
                {/* Category */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={S.label}>Primary Service Category</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SERVICE_CATS.map(c => (
                      <button key={c} onClick={() => setServices(p => ({ ...p, category: c }))} style={{
                        padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${services.category === c ? '#3B82F6' : '#E2E8F0'}`,
                        background: services.category === c ? '#EFF6FF' : '#fff', color: services.category === c ? '#1D4ED8' : '#374151',
                        fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                      }}>{c}</button>
                    ))}
                  </div>
                </div>
                {/* Sub-services */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={S.label}>Specific Services (select all that apply)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Deep cleaning','Regular cleaning','Move-in/out','Window cleaning','Carpet cleaning','Pressure washing','Appliance repair','Furniture assembly','Drywall','Tile & grout','Lock installation','Gutter cleaning'].map(s => (
                      <button key={s} onClick={() => toggleSub(s)} style={{
                        padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${services.sub_services.includes(s) ? '#8B5CF6' : '#E2E8F0'}`,
                        background: services.sub_services.includes(s) ? '#F5F3FF' : '#fff', color: services.sub_services.includes(s) ? '#6D28D9' : '#374151',
                        fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                {/* Areas */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={S.label}>Service Areas</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {BC_CITIES.map(c => (
                      <button key={c} onClick={() => toggleArea(c)} style={{
                        padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${services.service_areas.includes(c) ? '#059669' : '#E2E8F0'}`,
                        background: services.service_areas.includes(c) ? '#ECFDF5' : '#fff', color: services.service_areas.includes(c) ? '#065F46' : '#374151',
                        fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                      }}>{c}</button>
                    ))}
                  </div>
                </div>
                {/* Vehicle */}
                <div>
                  <label style={S.label}>Vehicle / Transport</label>
                  <select style={{ ...S.input, background: '#FAFAFA' }} value={services.vehicle} onChange={e => setServices(p => ({ ...p, vehicle: e.target.value }))}>
                    <option value="">Select…</option>
                    <option>Car / SUV</option><option>Truck / Van</option><option>No vehicle</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Experience */}
          {tab === 2 && (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Experience & Credentials</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Your background and qualifications</div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
                  <div>
                    <label style={S.label}>Years of Experience</label>
                    <input style={S.input} type="number" min="0" max="50" placeholder="5" value={experience.years_experience}
                      onChange={e => setExp(p => ({ ...p, years_experience: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.label}>Team Size</label>
                    <select style={{ ...S.input, background: '#FAFAFA' }} value={experience.team_size} onChange={e => setExp(p => ({ ...p, team_size: e.target.value }))}>
                      <option value="">Select…</option>
                      <option value="1">Solo (just me)</option><option value="2">2 people</option><option value="3">3–5 people</option><option value="10">6–10 people</option><option value="20">10+ people</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={S.label}>Professional Bio</label>
                  <textarea style={{ ...S.input, minHeight: '110px', resize: 'vertical' as const, lineHeight: 1.6 }} placeholder="Describe your experience, specialties, and what makes you stand out…" value={experience.bio} onChange={e => setExp(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {[
                    { key: 'is_licensed', label: 'Licensed & Certified' },
                    { key: 'is_insured',  label: 'Fully Insured' },
                  ].map(c => (
                    <label key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <div onClick={() => setExp(p => ({ ...p, [c.key]: !p[c.key as keyof typeof experience] }))}
                        style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${experience[c.key as keyof typeof experience] ? '#3B82F6' : '#CBD5E1'}`, background: experience[c.key as keyof typeof experience] ? '#3B82F6' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.12s' }}>
                        {experience[c.key as keyof typeof experience] && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#374151' }}>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Availability */}
          {tab === 3 && (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Availability Schedule</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>When you're available to take jobs</div>
              </div>
              <div style={{ padding: '24px' }}>
                {/* Active toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '22px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111' }}>Currently Available</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Toggle off when you're on vacation or fully booked</div>
                  </div>
                  <button onClick={() => setAvail(p => ({ ...p, available: !p.available }))} style={{
                    width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: availability.available ? '#059669' : '#CBD5E1', position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', left: availability.available ? '23px' : '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
                {/* Days */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={S.label}>Available Days</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {DAYS.map(day => (
                      <button key={day} onClick={() => toggleDay(day)} style={{
                        padding: '8px 14px', borderRadius: '8px', border: `1.5px solid ${availability.days.includes(day) ? '#3B82F6' : '#E2E8F0'}`,
                        background: availability.days.includes(day) ? '#EFF6FF' : '#fff', color: availability.days.includes(day) ? '#1D4ED8' : '#374151',
                        fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>{day.slice(0, 3)}</button>
                    ))}
                  </div>
                </div>
                {/* Hours */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={S.label}>Start Time</label>
                    <input type="time" style={S.input} value={availability.start_time} onChange={e => setAvail(p => ({ ...p, start_time: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.label}>End Time</label>
                    <input type="time" style={S.input} value={availability.end_time} onChange={e => setAvail(p => ({ ...p, end_time: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button style={S.btnSec} onClick={() => window.location.reload()}>Discard Changes</button>
            <button style={{ ...S.btnPri, opacity: isSaving ? 0.7 : 1 }} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving…' : '💾 Save All Changes'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
