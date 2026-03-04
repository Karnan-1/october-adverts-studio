import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Use env vars if available, otherwise use a safe no-op proxy
function createSafeClient(): SupabaseClient {
  try {
    if (supabaseUrl && supabaseAnonKey &&
        supabaseUrl.startsWith('https://') &&
        supabaseAnonKey.length > 20) {
      return createClient(supabaseUrl, supabaseAnonKey)
    }
  } catch (e) {
    console.warn('Failed to create Supabase client:', e)
  }
  // Return a client with a fully valid dummy JWT (won't connect but won't crash)
  // Valid JWT: header.payload.signature all base64url encoded
  const dummyUrl = 'https://placeholder.supabase.co'
  const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFub24iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  try {
    return createClient(dummyUrl, dummyKey)
  } catch (e) {
    console.warn('Supabase dummy client failed too:', e)
    // Last resort: return a minimal proxy object that won't crash on method calls
    return {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }), insert: () => Promise.resolve({ data: null, error: null }), update: () => Promise.resolve({ data: null, error: null }), delete: () => Promise.resolve({ data: null, error: null }), eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }) }),
      auth: { signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }), signOut: () => Promise.resolve({}), getSession: () => Promise.resolve({ data: { session: null }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    } as unknown as SupabaseClient
  }
}

export const supabase = createSafeClient()

console.log('[supabase] client initialized, url:', supabaseUrl || '(missing - using dummy)')

// Types for Admin Dashboard
export interface CaseStudy {
  id?: string;
  title: string;
  client: string;
  industry?: string;
  description: string;
  results?: string;
  image_url?: string;
  tags?: string;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
}

export interface Service {
  id?: string;
  title: string;
  tagline?: string;
  description: string;
  icon?: string;
  price_range?: string;
  deliverables?: string;
  sort_order?: number;
  published?: boolean;
  created_at?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  sort_order?: number;
  active?: boolean;
  created_at?: string;
}

export interface Testimonial {
  id?: string;
  client_name: string;
  client_role?: string;
  client_company?: string;
  content: string;
  rating?: number;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
}

export interface ContactLead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  service_interest?: string;
  status?: string;
  created_at?: string;
}

export interface AnalysisRequest {
  id?: string;
  project_description: string;
  created_at?: string;
}
