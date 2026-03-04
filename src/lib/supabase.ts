import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Create a safe supabase client that won't crash without env vars
let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      console.warn('Supabase env vars not configured. Admin features will be disabled.')
      // Return a mock client that won't crash the app
      supabaseInstance = createClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.placeholder'
      )
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return supabaseInstance
}

export const supabase = getSupabase()

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
