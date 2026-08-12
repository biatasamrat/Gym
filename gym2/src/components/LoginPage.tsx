import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ShieldCheck, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('biatasamrat31@gmail.com');
  const [role, setRole] = useState<'member' | 'admin'>('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">FitFlow Gym Portal</h2>
          <p className="text-xs text-slate-500">Sign in to access Member Portal & AI Fitness Coach</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Select Access Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2.5 rounded-xl font-bold border transition ${
                  role === 'member'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Member Portal
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 rounded-xl font-bold border transition ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Gym Admin
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>Enter FitFlow Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          <span>Don't have an account? </span>
          <button onClick={onSwitchToSignUp} className="font-bold text-blue-600 hover:underline">
            Register New Account
          </button>
        </div>
      </div>
    </div>
  );
};
