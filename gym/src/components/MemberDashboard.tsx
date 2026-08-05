import React, { useState } from 'react';
import { Member, CheckInLog, PaymentRecord } from '../types';
import { User, Calendar, CreditCard, ShieldCheck, Clock, CheckCircle, Activity, Award, Phone, Mail, FileText, Download, Sparkles } from 'lucide-react';

interface MemberDashboardProps {
  member: Member;
  checkIns: CheckInLog[];
  payments: PaymentRecord[];
  onCheckInNow: (memberId: string) => void;
  onOpenReportModal: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  checkIns,
  payments,
  onCheckInNow,
  onOpenReportModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'payments'>('overview');

  // Calculate days remaining
  const endDate = new Date(member.subscriptionEndDate);
  const today = new Date('2026-08-05'); // Current system date mock
  const diffTime = endDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const memberCheckIns = checkIns.filter((c) => c.memberId === member.id);
  const memberPayments = payments.filter((p) => p.memberId === member.id);

  return (
    <div className="space-y-8">
      
      {/* Top Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-blue-500/30 shadow-md shrink-0">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                {member.memberCode}
              </span>
              <span className="text-xs text-slate-400">Joined: {member.joinDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{member.fullName}</h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center space-x-4">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-blue-400" /> {member.phone}</span>
              <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-blue-400" /> {member.email}</span>
            </p>
          </div>
        </div>

        {/* Check-In Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onCheckInNow(member.id)}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Mark Daily Gym Check-In</span>
          </button>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Days Remaining Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription Validity</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-slate-900">{daysRemaining > 0 ? daysRemaining : 0}</span>
              <span className="text-sm font-semibold text-slate-500">Days Left</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">End Date: {member.subscriptionEndDate}</p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${
                daysRemaining <= 7 ? 'bg-amber-500' : daysRemaining <= 0 ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 90) * 100))}%` }}
            />
          </div>
        </div>

        {/* Current Duration & Plan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Duration Plan</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>

          <div className="my-4">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              {member.currentDuration.replace('_', ' ')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Standard Fitness Membership</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span>Start: {member.subscriptionStartDate}</span>
            <span className="font-bold text-slate-900">Equal Plan Access</span>
          </div>
        </div>

        {/* Payment Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="my-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                member.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : member.paymentStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {member.paymentStatus}
            </span>
            {member.amountDue > 0 && (
              <p className="text-xs text-rose-600 font-bold mt-2">
                Pending Balance: NPR {member.amountDue.toLocaleString()}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-500">Last Payment: {member.lastPaymentDate || 'N/A'}</p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Member Overview & Notes
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'history'
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Check-In & Usage History ({memberCheckIns.length})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
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
                <span className="font-semibold">{member.gender}, {member.age} yrs</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-900">{member.emergencyContact}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Fitness Goal:</span>
                <span className="font-semibold text-amber-600">{member.fitnessGoal || 'General Fitness'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Trainer Notes & Workout Preferences</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {member.notes || 'No specific workout notes recorded.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Attendance & Check-In Log</h3>

          {memberCheckIns.length === 0 ? (
            <p className="text-xs text-slate-500">No check-in logs recorded yet. Tap "Mark Daily Gym Check-In" above.</p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Subscription Payment History</h3>

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

    </div>
  );
};
