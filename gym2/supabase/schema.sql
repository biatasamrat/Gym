-- Create Supabase Database Schema for FitFlow Gym Management
-- WARNING: This script drops all existing tables before recreating them. 
-- ONLY use this for a fresh setup.

-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS public.reminders CASCADE;
DROP TABLE IF EXISTS public.check_ins CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create the Profiles Table (Maps to Member type and handles roles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  member_code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  age INTEGER,
  join_date DATE DEFAULT CURRENT_DATE,
  subscription_start_date DATE,
  subscription_end_date DATE,
  current_duration TEXT CHECK (current_duration IN ('1_month', '3_months', '6_months', '12_months')),
  payment_status TEXT CHECK (payment_status IN ('paid', 'pending', 'overdue')),
  amount_due NUMERIC DEFAULT 0,
  emergency_contact TEXT,
  fitness_goal TEXT,
  notes TEXT,
  last_payment_date DATE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Payments Table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  duration TEXT CHECK (duration IN ('1_month', '3_months', '6_months', '12_months')),
  payment_date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('eSewa', 'Khalti', 'Card', 'Cash', 'Bank Transfer')),
  status TEXT CHECK (status IN ('paid', 'pending', 'failed')),
  receipt_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create the Check-Ins Table
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create the Reminders Table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  subscription_end_date DATE,
  days_remaining INTEGER,
  status TEXT CHECK (status IN ('sent', 'pending', 'dismissed')),
  channel TEXT CHECK (channel IN ('SMS', 'Email', 'WhatsApp')),
  last_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_type TEXT CHECK (reminder_type IN ('7_days_notice', '3_days_notice', 'due_today', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Setup Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles Policies
-- Admins can do everything
CREATE POLICY "Admins have full access to profiles" 
  ON public.profiles FOR ALL 
  USING (public.is_admin());

-- Members can read and update their own profile
CREATE POLICY "Members can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Members can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
  
-- Allow insert during signup trigger or manual (we'll use service role or let auth do it)
-- Actually, letting authenticated users insert their own profile on signup is easier:
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Payments Policies
CREATE POLICY "Admins have full access to payments" 
  ON public.payments FOR ALL 
  USING (public.is_admin());

CREATE POLICY "Members can view own payments" 
  ON public.payments FOR SELECT 
  USING (auth.uid() = member_id);

-- Check-Ins Policies
CREATE POLICY "Admins have full access to check_ins" 
  ON public.check_ins FOR ALL 
  USING (public.is_admin());

CREATE POLICY "Members can view own check_ins" 
  ON public.check_ins FOR SELECT 
  USING (auth.uid() = member_id);

CREATE POLICY "Members can insert own check_ins" 
  ON public.check_ins FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

-- Reminders Policies
CREATE POLICY "Admins have full access to reminders" 
  ON public.reminders FOR ALL 
  USING (public.is_admin());

CREATE POLICY "Members can view own reminders" 
  ON public.reminders FOR SELECT 
  USING (auth.uid() = member_id);

-- ==============================================================================
-- HOW TO SET UP YOUR ADMIN ACCOUNT
-- ==============================================================================
-- 1. Run this entire script in the Supabase SQL Editor.
-- 2. Go to your running FitFlow app and Sign Up as a new user.
--    Example: email "admin@fitflow.com", password "securepassword123".
-- 3. Once you sign up, your account will be created as a 'member' by default.
-- 4. Come back to the Supabase SQL Editor and run the following command, 
--    replacing the email with the one you just used to sign up:
--
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@fitflow.com';
--
-- 5. Refresh your app, and you will now have Admin access!
