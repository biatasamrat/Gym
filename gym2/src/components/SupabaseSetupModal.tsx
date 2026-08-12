import React, { useState } from 'react';
import {
  SUPABASE_SETUP_SQL,
  isSupabaseConfigured,
  getCurrentSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
} from '../lib/supabase';
import { Database, Copy, Check, X, ShieldCheck, FileCode2, Terminal, ExternalLink, Link2, KeyRound, RefreshCw, Trash2 } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentConfig = getCurrentSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url.includes('your-supabase-project') ? '' : currentConfig.url);
  const [keyInput, setKeyInput] = useState(currentConfig.key.includes('your-supabase-anon-key') ? '' : currentConfig.key);
  const [showConfigForm, setShowConfigForm] = useState(!isSupabaseConfigured);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Please enter both your Supabase Project URL and Anon Public Key.');
      return;
    }
    saveCustomSupabaseConfig(urlInput, keyInput);
  };

  const handleClearCredentials = () => {
    if (confirm('Are you sure you want to clear your saved Supabase credentials?')) {
      clearCustomSupabaseConfig();
    }
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
                SQL schema, connection configuration, and Row Level Security (RLS) policies
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
                {isSupabaseConfigured ? 'Connected to Live Supabase' : 'Offline / Built-in Fallback Engine Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isSupabaseConfigured
                ? 'Your applet is connected to a live Supabase project! Signups, authentications, and profiles map directly to your remote database.'
                : 'You are currently using the built-in fallback engine. Paste your Supabase credentials below to connect your real database immediately.'}
            </p>
          </div>

          {/* Interactive Credentials Form */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                <Link2 className="w-4 h-4 text-blue-400" />
                <span>Connect Live Supabase Project</span>
              </h3>
              {currentConfig.isCustom && (
                <button
                  type="button"
                  onClick={handleClearCredentials}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Saved Credentials</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Supabase Anon Public Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-slate-400">
                  Find these in your Supabase Dashboard -&gt; Project Settings -&gt; API
                </p>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Save &amp; Connect Database</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>How to initialize Supabase Database Tables:</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-1">
              <li>Open your Supabase Project Dashboard.</li>
              <li>Navigate to the <strong>SQL Editor</strong> tab on the left sidebar.</li>
              <li>Click <strong>New Query</strong>, paste the SQL script below, and click <strong>RUN</strong>.</li>
              <li>This automatically creates the <code className="text-blue-300 bg-slate-800 px-1 py-0.5 rounded">profiles</code> table with role checking (<code className="text-purple-300">admin</code> &amp; <code className="text-emerald-300">member</code>), RLS policies, and triggers!</li>
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
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm border border-slate-700"
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

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-48">
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
