import React, { useState } from 'react';
import { SUPABASE_SETUP_SQL, isSupabaseConfigured } from '../lib/supabase';
import { Database, Copy, Check, X, ShieldCheck, FileCode2, Terminal, ExternalLink } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Supabase Database & Role-Based Auth Setup</span>
              </h2>
              <p className="text-xs text-slate-400">
                SQL schema, triggers, and Row Level Security (RLS) policies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs sm:text-sm">
          
          {/* Status Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Connection Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}
              >
                {isSupabaseConfigured ? 'Connected to Supabase' : 'Offline / Built-in Fallback Engine Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isSupabaseConfigured
                ? 'Your applet is actively configured with Supabase environment variables! All user signups and logins will query your Supabase database.'
                : 'You are currently testing in standalone mode. To connect your live Supabase project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
            </p>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>How to setup Supabase Database Tables:</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-1">
              <li>Open your Supabase Project Dashboard.</li>
              <li>Navigate to the <strong>SQL Editor</strong> tab on the left sidebar.</li>
              <li>Click <strong>New Query</strong>, paste the SQL script below, and click <strong>RUN</strong>.</li>
              <li>This automatically creates the <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded">profiles</code> table with role checking (<code className="text-purple-300">admin</code> & <code className="text-emerald-300">member</code>), RLS policies, and triggers!</li>
            </ol>
          </div>

          {/* Code Viewer Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center">
                <FileCode2 className="w-4 h-4 mr-1.5 text-blue-400" /> Complete Supabase SQL Script
              </span>
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-56">
              <pre>{SUPABASE_SETUP_SQL}</pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
