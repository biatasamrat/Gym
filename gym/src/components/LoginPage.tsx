import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDemoProfiles, isSupabaseConfigured, UserProfile } from '../lib/supabase';
import { Dumbbell, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Database, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
  onOpenSupabaseModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignUp, onOpenSupabaseModal }) => {
  const { login, loginAsDemo } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoProfiles = getAllDemoProfiles();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleQuickDemoClick = (profile: UserProfile) => {
    loginAsDemo(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 mb-1">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">FitFlow Gym Portal</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Supabase-Powered Role-Based Authentication System
          </p>
        </div>

        {/* Database Connection Status Bar */}
        <div
          onClick={onOpenSupabaseModal}
          className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition shadow-sm group"
        >
          <div className="flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
                <span>Database Engine:</span>
                {isSupabaseConfigured ? (
                  <span className="text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Supabase Connected
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 inline" /> Ready for Supabase / Local Mode
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="text-[11px] bg-blue-600/20 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition">
            DB Setup SQL
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span>Sign In to Account</span>
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@fitflow.com or user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">
                  (Demo: any password)
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Logins */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> Quick One-Click Demo Access
              </span>
              <span className="text-[10px] text-slate-500">Auto-fills role & dashboard</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {demoProfiles.slice(0, 3).map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleQuickDemoClick(profile)}
                  className="p-2.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition text-left group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 font-extrabold flex items-center justify-center text-[11px] border border-slate-700 shrink-0">
                      {profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-blue-400 transition">
                        {profile.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">{profile.email}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      profile.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {profile.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>Don't have an account yet? </span>
            <button
              onClick={onNavigateToSignUp}
              className="text-blue-400 font-bold hover:underline ml-1"
            >
              Sign Up for Gym Membership
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
