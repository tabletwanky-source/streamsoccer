import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  team_id: number;
  team_name: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  created_at: string;
}
