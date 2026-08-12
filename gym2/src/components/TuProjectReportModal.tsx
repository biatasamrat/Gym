import React from 'react';
import { X, BookOpen, Printer, Download, Award, GraduationCap } from 'lucide-react';

interface TuProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TuProjectReportModal: React.FC<TuProjectReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Tribhuvan University Project Documentation</h3>
              <p className="text-xs text-slate-400">BCA / CSIT Major Project • FitFlow Gym Management System</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-slate-700 leading-relaxed font-sans">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
            <h4 className="font-extrabold text-blue-900 text-sm mb-1">FitFlow Gym Management System (TU Project Format)</h4>
            <p className="text-blue-800">
              A full-stack modern web application designed for gym management in Nepal featuring Google Gemini AI coaching, automated SMS/email subscription expiry alerts, eSewa/Khalti payment integration, and targeted muscle workout databases.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">1. Project Abstract</h5>
            <p>
              Managing fitness centers manually often leads to subscription leakage, missed member renewals, and uncoordinated workout plans. FitFlow solves this by automating member registrations, tracking check-ins, integrating Nepalese digital wallets, and giving members instant access to an AI Personal Trainer powered by Google Gemini API.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">2. System Features & Modules</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Member Subscription Management:</strong> Tracks 1, 3, 6, and 12-month plans with automatic end-date calculation.</li>
              <li><strong>AI Fitness Coach:</strong> Express backend proxy to Google Gemini API for custom exercise routines and nutrition.</li>
              <li><strong>Nepalese Payment Integration:</strong> Direct gateway simulations for eSewa, Khalti, and card payments.</li>
              <li><strong>Body Part Exercise Library:</strong> Form step guides for Biceps, Triceps, Chest, Back, Shoulders, Legs, and Abs.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
