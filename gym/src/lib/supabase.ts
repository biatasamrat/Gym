import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'member';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  memberCode?: string;
  phone?: string;
  memberId?: string; // Maps to member in Gym database
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Built-in Demo & Fallback Users Store for local simulation & instant offline testing
const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'admin-1',
    email: 'admin@fitflow.com',
    fullName: 'Rajesh Sharma (Owner)',
    role: 'admin',
    memberCode: 'ADM-001',
    phone: '9851000000',
  },
  {
    id: 'm-1',
    email: 'aarav.sharma@gmail.com',
    fullName: 'Aarav Sharma',
    role: 'member',
    memberCode: 'GYM-2026-001',
    phone: '9841234567',
    memberId: 'm-1',
  },
  {
    id: 'm-2',
    email: 'priya.shrestha@hotmail.com',
    fullName: 'Priya Shrestha',
    role: 'member',
    memberCode: 'GYM-2026-002',
    phone: '9801987654',
    memberId: 'm-2',
  },
  {
    id: 'm-3',
    email: 'rohan.karki@outlook.com',
    fullName: 'Rohan Karki',
    role: 'member',
    memberCode: 'GYM-2026-003',
    phone: '9813554433',
    memberId: 'm-3',
  },
];

// Local storage keys
const LOCAL_USER_KEY = 'fitflow_auth_user';
const LOCAL_CUSTOM_USERS_KEY = 'fitflow_custom_users';

function getLocalCustomUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOM_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCustomUser(user: UserProfile) {
  const existing = getLocalCustomUsers();
  const updated = [...existing.filter((u) => u.email !== user.email), user];
  localStorage.setItem(LOCAL_CUSTOM_USERS_KEY, JSON.stringify(updated));
}

export function getStoredLocalUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredLocalUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

// SQL Script helper for Supabase Setup
export const SUPABASE_SETUP_SQL = `-- FITFLOW GYM MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Create Profiles Table for Role-Based Access Control
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  member_code TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Members Table for Gym Subscription Tracking
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  age INT,
  emergency_contact TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  current_duration TEXT NOT NULL DEFAULT '1_month',
  subscription_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subscription_end_date DATE NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid',
  amount_due NUMERIC DEFAULT 0,
  last_payment_date DATE,
  fitness_goal TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  receipt_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Members
CREATE POLICY "Members view own row" ON public.members FOR SELECT USING (email = (SELECT email FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admins manage all members" ON public.members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Trigger to Auto-Create Profile on Auth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, member_code, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(NEW.raw_user_meta_data->>'member_code', 'GYM-2026-' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

// Find profile in demo + custom list
export function findLocalUserByEmail(email: string): UserProfile | null {
  const norm = email.toLowerCase().trim();
  const customUsers = getLocalCustomUsers();
  const allUsers = [...customUsers, ...DEMO_PROFILES];
  return allUsers.find((u) => u.email.toLowerCase() === norm) || null;
}

export function getAllDemoProfiles(): UserProfile[] {
  const customUsers = getLocalCustomUsers();
  return [...customUsers, ...DEMO_PROFILES];
}
