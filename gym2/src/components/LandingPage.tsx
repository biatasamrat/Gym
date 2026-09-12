import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Shield, User, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">FitFlow</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Choose your portal to sign in to the gym management system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/login/admin"
            className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 p-6 rounded-3xl transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Admin Portal</h2>
                <p className="text-xs text-slate-400">Manage members, payments, and view analytics.</p>
              </div>
              <div className="flex items-center text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                <span>Sign in as Admin</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link
            to="/login/member"
            className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 p-6 rounded-3xl transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <User className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Member Portal</h2>
                <p className="text-xs text-slate-400">View your plans, workouts, and AI coach.</p>
              </div>
              <div className="flex items-center text-emerald-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                <span>Sign in as Member</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
