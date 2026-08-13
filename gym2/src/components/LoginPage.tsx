import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ArrowRight, Lock, Mail, AlertCircle, KeyRound, Shield, User } from 'lucide-react';

interface LoginPageProps {
  onSwitchToSignUp?: () => void;
  onNavigateToSignUp?: () => void;
  onOpenSupabaseModal?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp, onNavigateToSignUp }) => {
  const handleSignUpClick = onSwitchToSignUp || onNavigateToSignUp || (() => {});
  const { loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('biatasamrat31@gmail.com');
  const [password, setPassword] = useState('member123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginWithCredentials(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@fitflow.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  const fillMemberDemo = () => {
    setEmail('biatasamrat31@gmail.com');
    setPassword('member123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">FitFlow Gym Portal</h2>
          <p className="text-xs text-slate-500">Sign in with your email & password to access your role dashboard</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fills for instant testing */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] space-y-2">
          <div className="text-slate-500 font-semibold flex items-center justify-between">
            <span>Role Authentication Database Demo:</span>
            <KeyRound className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdminDemo}
              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold flex items-center justify-center space-x-1 transition"
            >
              <Shield className="w-3 h-3 text-purple-600" />
              <span>Fill Admin Credentials</span>
            </button>
            <button
              type="button"
              onClick={fillMemberDemo}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center justify-center space-x-1 transition"
            >
              <User className="w-3 h-3 text-emerald-600" />
              <span>Fill Member Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-500">
          <span>Don't have an account? </span>
          <button onClick={handleSignUpClick} className="font-bold text-blue-600 hover:underline">
            Register New Account
          </button>
        </div>
      </div>
    </div>
  );
};

