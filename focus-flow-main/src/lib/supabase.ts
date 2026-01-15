import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface DbUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  streak: number;
  longest_streak: number;
  last_checkin_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  time_spent: number;
  estimated_time?: number;
  remaining_time?: number;
  is_timer_running: boolean;
  priority: 'low' | 'medium' | 'high';
  xp_reward: number;
  created_at: string;
  completed_at?: string;
}
