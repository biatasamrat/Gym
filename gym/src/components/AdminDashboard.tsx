import React from 'react';
import { Member, GymStats, RenewalReminder } from '../types';
import { Users, Clock, AlertTriangle, DollarSign, Send, ArrowUpRight, TrendingUp, CheckCircle, Bell, UserPlus, CreditCard } from 'lucide-react';
import { DURATION_LABELS } from '../mockData';

interface AdminDashboardProps {
  stats: GymStats;
  members: Member[];
  expiringMembers: Member[];
  overdueMembers: Member[];
  reminders: RenewalReminder[];
  onSelectMember: (member: Member) => void;
  onSendReminder: (memberId: string) => void;
  onOpenAddMemberModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  members,
  expiringMembers,
  overdueMembers,
  reminders,
  onSelectMember,
  onSendReminder,
  onOpenAddMemberModal
}) => {
  return (
    <div className="space-y-8">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Admin Operational Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Gym Owner & Admin Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Real-time tracking for duration-based subscriptions (1M, 3M, 6M, 12M), payment status oversight, and automated renewal reminders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddMemberModal}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Member</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Active Members */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Members</span>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.activeMembers}</span>
            <span className="text-xs text-slate-500 font-medium">of {stats.totalMembers} total</span>
          </div>
          <div className="mt-3 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block font-semibold">
            Duration: 1M, 3M, 6M, 12M
          </div>
        </div>

        {/* Expiring This Week */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Expiring (7 Days)</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{stats.expiringThisWeek}</span>
            <span className="text-xs text-amber-700 font-medium">Needs Renewal</span>
          </div>
          <div className="mt-3 text-xs text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-md inline-block font-semibold">
            Automated Reminder Ready
          </div>
        </div>

        {/* Overdue Accounts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Overdue Accounts</span>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-600">{stats.overdueMembers}</span>
            <span className="text-xs text-rose-600 font-medium">Lapsed Subscriptions</span>
          </div>
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md inline-block font-semibold">
            Pending: NPR {stats.pendingPaymentsAmount.toLocaleString()}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Est. Monthly Revenue</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">NPR {stats.monthlyRevenue.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12.4%
            </span>
          </div>
          <div className="mt-3 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block font-semibold">
            All Duration Subscriptions
          </div>
        </div>

      </div>

      {/* Main Content Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Cols: Subscriptions Expiring Soon & Overdue List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Expiring Soon Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Subscriptions Expiring Within 7 Days</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Quickly send automated renewal reminders before expiration</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                {expiringMembers.length} Members
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {expiringMembers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No member subscriptions expiring in the next 7 days.
                </div>
              ) : (
                expiringMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectMember(member)}>
                      <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm border-2 border-amber-200 shrink-0">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition">
                          {member.fullName}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                          <span>{member.memberCode}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{member.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-amber-600 font-bold block">
                          Expires: {member.subscriptionEndDate}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Duration: {member.currentDuration.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => onSendReminder(member.id)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 shadow-sm shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reminder</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Overdue Subscriptions & Unpaid Fees</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Lapsed subscriptions requiring urgent payment follow-up</p>
              </div>
              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                {overdueMembers.length} Overdue
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {overdueMembers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Great! No overdue accounts recorded.
                </div>
              ) : (
                overdueMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-rose-50/30 transition"
                  >
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectMember(member)}>
                      <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-800 font-extrabold flex items-center justify-center text-sm border-2 border-rose-200 shrink-0">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-rose-600 transition">
                          {member.fullName}
                        </h4>
                        <span className="text-xs text-rose-600 font-bold">
                          Due Amount: NPR {member.amountDue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-left sm:text-right text-xs">
                        <span className="text-slate-500 block">Lapsed On:</span>
                        <span className="font-bold text-rose-600 block">{member.subscriptionEndDate}</span>
                      </div>

                      <button
                        onClick={() => onSendReminder(member.id)}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1 shadow-sm"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right 1-Col: Recent Reminder Activity & Quick Duration Rules */}
        <div className="space-y-6">
          
          {/* Automated Renewal Reminder Log */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Automated Reminder Log</span>
            </h3>

            <div className="space-y-4">
              {reminders.length === 0 ? (
                <p className="text-xs text-slate-500">No recent reminders sent.</p>
              ) : (
                reminders.slice(0, 5).map((rem) => (
                  <div key={rem.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{rem.memberName}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-semibold">
                        {rem.channel} Sent
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Target: {rem.phone} | End: {rem.subscriptionEndDate}
                    </p>
                    <p className="text-[10px] text-slate-400 text-right">{rem.lastSentAt || 'Just now'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pricing & Duration Plan Overview */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <h3 className="font-bold text-base mb-1 text-blue-400">Fixed Duration Plans</h3>
            <p className="text-xs text-slate-300 mb-4">
              Single-tier gym pricing divided strictly by duration (No VIP/Silver tiers).
            </p>

            <div className="space-y-2.5 text-xs">
              {Object.entries(DURATION_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-semibold text-slate-200">{label.split('(')[0]}</span>
                  <span className="font-extrabold text-blue-400">({label.split('(')[1]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
