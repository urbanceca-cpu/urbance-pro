import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const supabase = createClient();

export interface ProviderProfile {
  id: string;
  role: 'provider' | 'admin';
  full_name: string | null;
  phone: string | null;
  city: string | null;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[Auth] Error getting session:', error.message);
    return null;
  }
  
  return session;
}

/**
 * Get the current user
 */
export async function getUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('[Auth] Error getting user:', error.message);
    return null;
  }
  
  return user;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('[Auth] Error signing out:', error.message);
    throw error;
  }
}

/**
 * Ensure a provider profile exists for the user
 * Creates one if it doesn't exist
 */
export async function ensureProviderProfile(user: User): Promise<ProviderProfile | null> {
  // First, try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    return existingProfile as ProviderProfile;
  }

  // If no profile exists, create one
  if (fetchError && fetchError.code === 'PGRST116') {
    const newProfile = {
      id: user.id,
      role: 'provider' as const,
      full_name: user.user_metadata?.full_name || null,
      phone: null,
      city: null,
      status: 'pending' as const,
    };

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error('[Auth] Error creating profile:', createError.message);
      return null;
    }

    return createdProfile as ProviderProfile;
  }

  if (fetchError) {
    console.error('[Auth] Error fetching profile:', fetchError.message);
  }

  return null;
}

/**
 * Get provider profile for current user
 */
export async function getProviderProfile(): Promise<ProviderProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('[Auth] Error getting profile:', error.message);
    return null;
  }

  return data as ProviderProfile;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
