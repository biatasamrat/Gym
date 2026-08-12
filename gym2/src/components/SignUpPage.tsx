import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, isSupabaseConfigured } from '../lib/supabase';
import { Dumbbell, User, Mail, Lock, Phone, ShieldCheck, ArrowLeft, CheckCircle, AlertCircle, UserCheck, Shield } from 'lucide-react';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onOpenSupabaseModal: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin, onOpenSupabaseModal }) => {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({
      fullName,
      email,
      password,
      role,
      phone,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
    } else {
      setErrorMsg(result.error || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToLogin}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Dumbbell className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-white">FitFlow Registration</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Your Account</h1>
            <p className="text-xs text-slate-400">
              Register for Role-Based Gym Access & Personal Dashboard
            </p>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2 text-emerald-300 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SignUp Form */}
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            
            {/* Role Selector Cards */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Select Account Role <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Member Role Card */}
                <div
                  onClick={() => setRole('member')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    role === 'member'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <UserCheck className={`w-5 h-5 ${role === 'member' ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span
                      className={`w-3 h-3 rounded-full border ${
                        role === 'member' ? 'bg-blue-500 border-blue-400' : 'border-slate-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Member Role</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Personal workout portal, check-in history & receipts
                    </div>
                  </div>
                </div>

                {/* Admin Role Card */}
                <div
                  onClick={() => setRole('admin')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    role === 'admin'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span
                      className={`w-3 h-3 rounded-full border ${
                        role === 'admin' ? 'bg-purple-500 border-purple-400' : 'border-slate-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Admin / Owner</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Gym stats, member registry & payment controls
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Thapa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="suman@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="At least 4 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="9841000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <span>Registering Account in Supabase...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Account & Register {role === 'admin' ? 'Admin' : 'Member'}</span>
                </>
              )}
            </button>
          </form>

          {/* Login Option */}
          <div className="text-center pt-3 border-t border-slate-800/60 text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              onClick={onNavigateToLogin}
              className="text-blue-400 font-bold hover:underline ml-1"
            >
              Sign In Instead
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
