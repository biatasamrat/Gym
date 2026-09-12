import React, { useState } from 'react';
import { Member, CheckInLog, PaymentRecord, SubscriptionDuration } from '../types';
import { WorkoutLibrary } from './WorkoutLibrary';
import { AIChatbot } from './AIChatbot';
import { MemberPaymentModal } from './MemberPaymentModal';
import {
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle,
  Activity,
  Award,
  Phone,
  Mail,
  FileText,
  Download,
  Sparkles,
  Dumbbell,
  Bot,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface MemberDashboardProps {
  member?: Member;
  checkIns?: CheckInLog[];
  payments?: PaymentRecord[];
  onCheckInNow?: (memberId: string) => void;
  onOpenReportModal?: () => void;
  onPaymentSuccess?: (payment: PaymentRecord, duration: SubscriptionDuration, newEndDate: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  checkIns = [],
  payments = [],
  onCheckInNow,
  onOpenReportModal,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'ai_coach' | 'history' | 'payments'>('overview');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  const activeMember = member || {
    id: 'm-default',
    memberCode: 'FF-1005',
    fullName: 'Gym Member',
    email: 'member@gmail.com',
    phone: '9811223344',
    gender: 'Male' as const,
    age: 25,
    joinDate: '2025-06-10',
    subscriptionStartDate: '2026-05-01',
    subscriptionEndDate: '2026-11-01',
    currentDuration: '6_months' as SubscriptionDuration,
    paymentStatus: 'paid' as const,
    amountDue: 0,
    emergencyContact: 'Emergency Contact - 9800998877',
    fitnessGoal: 'General Fitness & Toning',
    notes: 'Consistency and proper form.',
  };

  // Calculate days remaining
  const endDate = activeMember.subscriptionEndDate ? new Date(activeMember.subscriptionEndDate) : null;
  const today = new Date();
  const diffTime = endDate ? endDate.getTime() - today.getTime() : null;
  const daysRemaining = diffTime !== null ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;

  const memberCheckIns = checkIns.filter((c) => c.memberId === activeMember.id);
  const memberPayments = payments.filter((p) => p.memberId === activeMember.id);

  const handleAskAICoachFromWorkout = (promptText: string) => {
    setAiPrompt(promptText);
    setActiveTab('ai_coach');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-blue-500/30 shadow-md shrink-0">
            {activeMember.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                {activeMember.memberCode}
              </span>
              <span className="text-xs text-slate-400">Joined: {activeMember.joinDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{activeMember.fullName}</h1>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-4">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-blue-400" /> {activeMember.phone}</span>
              <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-blue-400" /> {activeMember.email}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay / Renew Membership</span>
          </button>

          <button
            onClick={() => onCheckInNow && onCheckInNow(activeMember.id)}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2 shrink-0"
          >
            <Activity className="w-4 h-4" />
            <span>Mark Gym Check-In</span>
          </button>
        </div>
      </div>

      {/* Subscription Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Days Remaining Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription Validity</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-slate-900">
                {daysRemaining !== null ? (daysRemaining > 0 ? daysRemaining : 0) : '—'}
              </span>
              <span className="text-sm font-semibold text-slate-500">Days Remaining</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              End Date: {activeMember.subscriptionEndDate || 'Not yet set'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full ${
                  daysRemaining === null ? 'bg-slate-300' : daysRemaining <= 7 ? 'bg-amber-500' : daysRemaining <= 0 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: daysRemaining !== null ? `${Math.min(100, Math.max(5, (daysRemaining / 90) * 100))}%` : '5%' }}
              />
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Renew online now via eSewa/Khalti</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Duration & Plan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Plan</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              {activeMember.currentDuration ? activeMember.currentDuration.replace(/_/g, ' ') : 'No Plan Yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Full Gym Access + Workout Library</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span>Started: {activeMember.subscriptionStartDate || 'Not yet set'}</span>
            <span className={`font-bold ${activeMember.subscriptionStartDate ? 'text-emerald-600' : 'text-amber-600'}`}>
              {activeMember.subscriptionStartDate ? 'Active' : 'Pending Setup'}
            </span>
          </div>
        </div>

        {/* Payment Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                activeMember.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : activeMember.paymentStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {activeMember.paymentStatus}
            </span>
            {activeMember.amountDue > 0 && (
              <p className="text-xs text-rose-600 font-bold mt-2">
                Pending Balance: NPR {activeMember.amountDue.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center justify-center space-x-1"
          >
            <span>Open Member Payment Gateway</span>
          </button>
        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto space-x-4 sm:space-x-6 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Profile
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'workouts'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4 text-amber-600" />
          <span>Workouts by Body Part</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_coach')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'ai_coach'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4 text-blue-600" />
          <span>AI Fitness Coach</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase">
            Gemini
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Check-In History ({memberCheckIns.length})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Payment Receipts ({memberPayments.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Personal Details & Emergency Contact</h3>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gender & Age:</span>
                <span className="font-semibold">
                  {[activeMember.gender, activeMember.age ? `${activeMember.age} yrs` : null].filter(Boolean).join(', ') || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-900">{activeMember.emergencyContact || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Fitness Goal:</span>
                <span className="font-semibold text-amber-600">{activeMember.fitnessGoal || 'General Fitness'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Trainer Notes & Workout Preferences</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {activeMember.notes || 'No specific workout notes recorded.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <WorkoutLibrary onAskAICoach={handleAskAICoachFromWorkout} />
      )}

      {activeTab === 'ai_coach' && (
        <AIChatbot
          member={activeMember}
          initialPrompt={aiPrompt}
          onClearInitialPrompt={() => setAiPrompt('')}
        />
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Attendance & Check-In Log</h3>

          {memberCheckIns.length === 0 ? (
            <p className="text-xs text-slate-500">No check-in logs recorded yet. Tap "Mark Gym Check-In" above.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {memberCheckIns.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800">{log.checkInTime}</span>
                  </div>
                  <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{log.notes}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Subscription Payment History</h3>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Make New Payment</span>
            </button>
          </div>

          {memberPayments.length === 0 ? (
            <p className="text-xs text-slate-500">No historical payments recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {memberPayments.map((pay) => (
                <div key={pay.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{pay.receiptNumber}</span>
                    <span className="text-slate-500">{pay.paymentDate} via {pay.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">NPR {pay.amount.toLocaleString()}</span>
                    <span className="text-emerald-600 font-semibold uppercase text-[10px]">{pay.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Gateway Modal */}
      <MemberPaymentModal
        isOpen={isPaymentModalOpen}
        member={activeMember}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={(payment, newDuration, newEndDate) => {
          if (onPaymentSuccess) {
            onPaymentSuccess(payment, newDuration, newEndDate);
          }
        }}
      />

    </div>
  );
};
