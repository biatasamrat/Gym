import React from 'react';
import { X, Database, CheckCircle2 } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Database Connection Status</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          FitFlow is using in-memory state with pre-configured mock data for seamless demo performance.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Local State Engine Active</span>
          </div>
          <p className="text-slate-500 pl-6">Supports all member check-ins, payment renewals & Gemini AI coaching!</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
