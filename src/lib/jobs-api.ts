import { createClient } from '@/lib/supabase/client';

export type JobStatus = 'accepted' | 'assigned' | 'enroute' | 'completed' | 'cancelled';

export interface ProviderJob {
  id: string;
  booking_id: string | null;
  partner_id: string | null;
  service_name: string;
  customer_name: string;
  customer_phone: string | null;
  service_address: string;
  service_city: string;
  latitude: number | null;
  longitude: number | null;
  status: JobStatus;
  eta: string | null;
  payout_amount: number;
  scheduled_date: string;
  scheduled_time: string | null;
  service_details: string | null;
  created_at: string;
  updated_at: string;
  has_additional_charges: boolean;
  final_amount: number | null;
  payment_captured: boolean;
}

export interface ProviderProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

export interface EarningsSummary {
  totalGross: number;
  totalNet: number;
  thisMonthNet: number;
  inProgressNet: number;
  completedJobs: ProviderJob[];
}

export interface DashboardSummary {
  completedCount: number;
  activeCount: number;
  availableCount: number;
  totalEarned: number;
}

const COMMISSION = 0.12;
export const netAmount = (gross: number) => gross * (1 - COMMISSION);

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function fetchAvailableJobs(): Promise<ApiResult<ProviderJob[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'accepted')
    .is('partner_id', null)
    .order('scheduled_date', { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as ProviderJob[], error: null };
}

export async function acceptJob(jobId: string, userId: string): Promise<ApiResult<ProviderJob>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .update({ partner_id: userId, status: 'assigned', updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .eq('status', 'accepted')
    .is('partner_id', null)
    .select()
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Job already taken by another provider.' };
  return { data: data as ProviderJob, error: null };
}

export async function fetchMyJobs(userId: string): Promise<ApiResult<ProviderJob[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('partner_id', userId)
    .order('scheduled_date', { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data: data as ProviderJob[], error: null };
}

export async function startJob(jobId: string, userId: string): Promise<ApiResult<ProviderJob>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'enroute', updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .eq('partner_id', userId)
    .eq('status', 'assigned')
    .select()
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Could not start job.' };
  return { data: data as ProviderJob, error: null };
}

export async function completeJob(jobId: string, userId: string): Promise<ApiResult<ProviderJob>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .eq('partner_id', userId)
    .eq('status', 'enroute')
    .select()
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Could not complete job.' };
  return { data: data as ProviderJob, error: null };
}

export async function fetchEarnings(userId: string): Promise<ApiResult<EarningsSummary>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('partner_id', userId)
    .order('updated_at', { ascending: false });
  if (error) return { data: null, error: error.message };

  const jobs = (data ?? []) as ProviderJob[];
  const completed = jobs.filter(j => j.status === 'completed');
  const active = jobs.filter(j => j.status === 'assigned' || j.status === 'enroute');

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalGross = completed.reduce((s, j) => s + (j.final_amount ?? j.payout_amount), 0);
  const totalNet = totalGross * (1 - COMMISSION);
  const thisMonthGross = completed
    .filter(j => j.updated_at >= monthStart)
    .reduce((s, j) => s + (j.final_amount ?? j.payout_amount), 0);
  const thisMonthNet = thisMonthGross * (1 - COMMISSION);
  const inProgressNet = active.reduce((s, j) => s + j.payout_amount * (1 - COMMISSION), 0);

  return {
    data: { totalGross, totalNet, thisMonthNet, inProgressNet, completedJobs: completed },
    error: null,
  };
}

export async function fetchDashboardSummary(userId: string): Promise<ApiResult<DashboardSummary>> {
  const supabase = createClient();
  const [{ data: myJobs }, { data: available }] = await Promise.all([
    supabase.from('jobs').select('id, status, payout_amount, final_amount').eq('partner_id', userId),
    supabase.from('jobs').select('id').eq('status', 'accepted').is('partner_id', null),
  ]);

  const jobs = (myJobs ?? []) as { id: string; status: string; payout_amount: number; final_amount: number | null }[];
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const activeJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'enroute');
  const totalGross = completedJobs.reduce((s, j) => s + (j.final_amount ?? j.payout_amount), 0);

  return {
    data: {
      completedCount: completedJobs.length,
      activeCount: activeJobs.length,
      availableCount: (available ?? []).length,
      totalEarned: totalGross * (1 - COMMISSION),
    },
    error: null,
  };
}
