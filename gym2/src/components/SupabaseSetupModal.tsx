import React, { useState } from 'react';
import { X, Database, CheckCircle2, Copy, Check, Code } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_SQL_SCRIPT = `-- =========================================================
-- FITFLOW GYM PORTAL - CLEAN SUPABASE DATABASE SCHEMA SCRIPT
-- Fixes UUID vs BIGINT type mismatch & creates all tables
-- =========================================================

-- 1. Clean up stale/existing tables to prevent type mismatch
DROP TABLE IF EXISTS public.check_ins CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create Profiles Table (Role-Based Access Control)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  member_code TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Members Table for Gym Subscription Tracking
CREATE TABLE public.members (
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
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'overdue')),
  amount_due NUMERIC DEFAULT 0,
  last_payment_date DATE,
  fitness_goal TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Payments Table (member_id matches members.id as UUID)
CREATE TABLE public.payments (
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

-- 5. Create Check-Ins Table
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes TEXT
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies
-- Profiles Policy
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Members Policy
CREATE POLICY "Members view own data" ON public.members FOR SELECT USING (email = (SELECT email FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admins manage all members" ON public.members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments Policy
CREATE POLICY "Admins manage all payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Check-Ins Policy
CREATE POLICY "Admins manage all check-ins" ON public.check_ins FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 8. Auto-Create Profile Trigger on Auth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, member_code, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', CASE WHEN NEW.email LIKE '%admin%' THEN 'admin' ELSE 'member' END),
    COALESCE(NEW.raw_user_meta_data->>'member_code', 'FF-' || LPAD(FLOOR(RANDOM() * 8999 + 1000)::TEXT, 4, '0')),
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

-- 9. Insert Default Gym Members Seed Data
INSERT INTO public.members (
  member_code, full_name, email, phone, gender, age, join_date,
  subscription_start_date, subscription_end_date, current_duration, payment_status, amount_due, fitness_goal
) VALUES
('FF-1005', 'Kiran Shrestha', 'biatasamrat31@gmail.com', '9811223344', 'Male', 25, '2025-06-10', '2026-05-01', '2026-11-01', '6_months', 'paid', 0, 'General Fitness & Toning'),
('FF-1001', 'Aarav Sharma', 'aarav.sharma@gmail.com', '9841234567', 'Male', 26, '2025-01-15', '2026-01-15', '2026-07-15', '6_months', 'paid', 0, 'Muscle Gain & Hypertrophy'),
('FF-1002', 'Sita Adhikari', 'sita.adhikari@yahoo.com', '9801987654', 'Female', 24, '2025-03-01', '2026-03-01', '2026-06-01', '3_months', 'pending', 4500, 'Weight Loss & Cardio');
`;

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Supabase SQL Schema Setup</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed shrink-0">
          This SQL script fixes the <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono">UUID vs BIGINT</code> constraint mismatch error and builds all tables (<code className="font-mono">profiles</code>, <code className="font-mono">members</code>, <code className="font-mono">payments</code>, <code className="font-mono">check_ins</code>) with automatic RLS security policies.
        </p>

        <div className="relative flex-1 min-h-0 bg-slate-900 rounded-2xl p-4 overflow-auto border border-slate-800">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition z-10"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
          </button>
          <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre leading-relaxed pr-28">
            {SUPABASE_SQL_SCRIPT}
          </pre>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center space-x-2 text-emerald-800 shrink-0">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Copy this code into your Supabase project's SQL Editor and click <strong>RUN</strong>!</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shrink-0"
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

