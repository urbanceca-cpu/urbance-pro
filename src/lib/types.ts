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

// Application Types — matches actual DB schema (JSONB columns)
export interface ProviderApplication {
  id: string;
  user_id: string | null;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  basic_info: {
    full_legal_name?: string;
    business_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    address_line1?: string;
    postal_code?: string;
  };
  services_coverage: {
    primary_category?: string;
    sub_services?: string[];
    service_areas?: string[];
    max_travel_km?: string;
    has_vehicle?: string;
  };
  experience_standards: {
    years_experience?: string;
    professional_bio?: string;
    team_size?: string;
    is_licensed?: string;
    license_details?: string;
    is_insured?: string;
    policy_limit?: string;
    background_check?: string;
  };
  pricing_availability: {
    pricing_model?: string;
    min_job_price?: string;
    availability?: string[];
    earliest_start?: string;
    scheduling_notes?: string;
    available?: boolean;
  };
  step_completed: Record<string, boolean>;
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
