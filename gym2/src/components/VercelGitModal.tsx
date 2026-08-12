import React, { useState } from 'react';
import {
  GitBranch,
  Github,
  Globe,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  X,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';

interface VercelGitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelGitModal: React.FC<VercelGitModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Initialize Git Local Repository',
      description: 'Open your terminal inside the root directory of this project and run the following commands:',
      commands: [
        'git init',
        'git add .',
        'git commit -m "Initial release: FitFlow Gym Management System with Supabase Auth & Durations"',
      ],
    },
    {
      title: 'Step 2: Create a GitHub Repository & Push Code',
      description: 'Create a new empty repository on GitHub (e.g., fitflow-gym-portal) and push your local branch:',
      commands: [
        'git branch -M main',
        'git remote add origin https://github.com/YOUR_GITHUB_USERNAME/fitflow-gym-portal.git',
        'git push -u origin main',
      ],
    },
    {
      title: 'Step 3: Connect to Vercel & Deploy',
      description: 'Deploy to Vercel with automatic continuous integration in 3 simple clicks:',
      details: [
        'Log in to your Vercel Dashboard (https://vercel.com) and click "Add New... -> Project".',
        'Select "Import" next to your newly created GitHub repository (fitflow-gym-portal).',
        'Vercel will automatically detect Vite. Keep Framework Preset as "Vite".',
        'Under Environment Variables, add: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
        'Click "Deploy". Your app is live in less than 30 seconds!',
      ],
    },
    {
      title: 'Step 4: Continuous Deployment via Git Push',
      description: 'Every time you make updates to your project, simply run:',
      commands: [
        'git add .',
        'git commit -m "Updated features & member subscription flows"',
        'git push origin main',
      ],
      note: 'Vercel will automatically trigger a new production build and update your live website instantly!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full text-white shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-slate-800 to-black text-white rounded-2xl border border-slate-700 shadow-sm flex items-center space-x-2">
              <Github className="w-5 h-5 text-white" />
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span>Vercel & GitHub Deployment Guide</span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Version control, Git migration, and automatic CI/CD deployment on Vercel
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

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Overview Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Full Vercel & GitHub Integration Included</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We have pre-configured <code className="text-blue-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">vercel.json</code> to handle single-page SPA routing rewrites automatically. Follow the steps below to push your repository to GitHub and link Vercel for instant deployments.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold flex items-center justify-center text-xs border border-blue-500/30">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </h3>
                </div>

                <p className="text-slate-400 leading-normal">{step.description}</p>

                {/* Commands Block */}
                {step.commands && (
                  <div className="bg-black/90 rounded-xl border border-slate-800 p-3.5 space-y-2 font-mono text-[11px] relative group">
                    {step.commands.map((cmd, cIdx) => {
                      const globalIndex = idx * 10 + cIdx;
                      return (
                        <div key={cIdx} className="flex items-start justify-between gap-3 text-slate-200">
                          <div className="flex items-start space-x-2 overflow-x-auto">
                            <span className="text-blue-500 select-none">$</span>
                            <span className="whitespace-pre">{cmd}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(cmd, globalIndex)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition shrink-0"
                            title="Copy command"
                          >
                            {copiedIndex === globalIndex ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Details List */}
                {step.details && (
                  <ul className="space-y-2 text-slate-300 list-disc list-inside bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}

                {step.note && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{step.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Environment Variables Reference */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Required Vercel Environment Variables</span>
            </h4>
            <p className="text-slate-400">
              When importing your project into Vercel, copy these variables from your <code className="text-slate-300">.env</code> file into Vercel Settings -&gt; Environment Variables:
            </p>
            <div className="bg-black/90 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
              <div>VITE_SUPABASE_URL=your_supabase_project_url</div>
              <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Ready for Vercel production hosting</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-md"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
