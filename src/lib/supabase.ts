import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-project.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
)

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
  active?: boolean;
  created_at?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  sort_order?: number;
  active?: boolean;
  created_at?: string;
}

export interface Testimonial {
  id?: string;
  client_name: string;
  company?: string;
  role?: string;
  quote: string;
  rating?: number;
  photo_url?: string;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
}

export interface ContactLead {
  id?: string;
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  status?: 'new' | 'contacted' | 'converted' | 'archived';
  created_at?: string;
}

export interface AnalysisRequest {
  id?: number;
  project_description?: string;
  created_at?: string;
}
