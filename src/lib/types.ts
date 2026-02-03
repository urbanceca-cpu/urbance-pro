// User & Auth Types
export type UserRole = 'provider' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Application Types
export interface ProviderApplication {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  services: string[]; // array of service keys
  experience_years: number;
  availability: Record<string, unknown>;
  background_check_consent: boolean;
  insurance_status: string;
  notes: string | null;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Services
export interface ProviderService {
  id: string;
  provider_id: string;
  service_key: string;
  price_hint: number | null;
  active: boolean;
  created_at: string;
}

// Jobs
export interface Job {
  id: string;
  customer_ref: string | null;
  provider_id: string;
  service_key: string;
  address: string;
  scheduled_at: string;
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  subtotal: number;
  service_fee: number;
  created_at: string;
}

// Payouts
export interface Payout {
  id: string;
  provider_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  period_start: string;
  period_end: string;
  created_at: string;
}

// Documents
export interface Document {
  id: string;
  provider_id: string;
  type: string;
  url: string;
  status: 'required' | 'submitted' | 'verified' | 'expired';
  expires_at: string | null;
  created_at: string;
}

// Support
export interface SupportTicket {
  id: string;
  provider_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}
