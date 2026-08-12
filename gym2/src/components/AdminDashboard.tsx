import React from 'react';
import { Member, PaymentRecord, CheckInLog, RenewalReminder } from '../types';
import {
  Users,
  CreditCard,
  Activity,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Send,
  CheckCircle,
  Bell
} from 'lucide-react';

interface AdminDashboardProps {
  members: Member[];
  payments: PaymentRecord[];
  checkIns: CheckInLog[];
  reminders: RenewalReminder[];
  onOpenAddMember: () => void;
  onSendReminder: (reminderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  members,
  payments,
  checkIns,
  reminders,
  onOpenAddMember,
  onSendReminder,
}) => {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.paymentStatus === 'paid').length;
  const pendingMembers = members.filter((m) => m.paymentStatus === 'pending' || m.paymentStatus === 'overdue').length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Members</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalMembers}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">{activeMembers} Active Subscriptions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue</span>
            <h3 className="text-2xl font-extrabold text-slate-900">NPR {totalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-slate-500">Collected from all plans</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Payments</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{pendingMembers}</h3>
            <span className="text-[11px] text-amber-600 font-semibold">Requires Renewal SMS</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Today's Check-Ins</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{checkIns.length}</h3>
            <span className="text-[11px] text-slate-500">Gym Attendance Log</span>
          </div>
        </div>
      </div>

      {/* Expiry Reminders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Subscription Expiry & Renewal Reminders</span>
            </h3>
            <p className="text-xs text-slate-500">Automated SMS/WhatsApp alerts for upcoming gym membership renewals</p>
          </div>

          <button
            onClick={onOpenAddMember}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            + Add New Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Member Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Days Left</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reminders.map((rem) => (
                <tr key={rem.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{rem.memberName}</td>
                  <td className="p-3 text-slate-600">{rem.phone}</td>
                  <td className="p-3 font-medium">{rem.subscriptionEndDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {rem.daysRemaining} Days
                    </span>
                  </td>
                  <td className="p-3 uppercase text-[10px] font-bold text-emerald-600">{rem.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSendReminder(rem.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs border border-blue-200 transition inline-flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Alert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
