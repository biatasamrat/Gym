import React from 'react';
import { X, Github, Globe, CheckCircle2 } from 'lucide-react';

interface VercelGitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelGitModal: React.FC<VercelGitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-base">GitHub & Vercel Deployment</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          This project is fully ready for export to GitHub and 1-click deployment on Vercel or Cloud Run.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-1">
          <div className="flex items-center space-x-2 text-blue-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Deployment Config Present</span>
          </div>
          <p className="text-blue-700 pl-6">
            <code>vercel.json</code> & <code>server.ts</code> bundled via esbuild CJS target.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
