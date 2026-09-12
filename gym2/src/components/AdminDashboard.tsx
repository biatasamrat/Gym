import React from 'react';
import { Member, PaymentRecord, CheckInLog, RenewalReminder, GymStats } from '../types';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Activity,
  AlertTriangle,
  DollarSign,
  Calendar,
  Send,
  Bell,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardProps {
  members?: Member[];
  payments?: PaymentRecord[];
  checkIns?: CheckInLog[];
  reminders?: RenewalReminder[];
  stats?: GymStats;
  expiringMembers?: Member[];
  overdueMembers?: Member[];
  onOpenAddMember?: () => void;
  onOpenAddMemberModal?: () => void;
  onSelectMember?: (member: Member) => void;
  onSendReminder?: (reminderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  members = [],
  payments = [],
  checkIns = [],
  reminders = [],
  stats,
  expiringMembers = [],
  overdueMembers = [],
  onOpenAddMember,
  onOpenAddMemberModal,
  onSelectMember,
  onSendReminder,
}) => {
  const handleOpenAdd = onOpenAddMember || onOpenAddMemberModal || (() => {});

  // Live computed stats directly from real data (not mock)
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.paymentStatus === 'paid').length;
  const pendingCount = members.filter((m) => m.paymentStatus === 'pending' || m.paymentStatus === 'overdue').length;
  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);

  const todayStr = new Date().toDateString();
  const todayCheckIns = checkIns.filter((c) => new Date(c.checkInTime).toDateString() === todayStr).length;

  // Recent 5 payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  // Members expiring within 7 days
  const soonExpiring = members.filter((m) => {
    if (!m.subscriptionEndDate) return false;
    const diff = Math.ceil((new Date(m.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Members</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalMembers}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">{activeMembers} Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue</span>
            <h3 className="text-2xl font-extrabold text-slate-900">NPR {totalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-slate-500">{payments.length} payment{payments.length !== 1 ? 's' : ''} recorded</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Pending / Overdue</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{pendingCount}</h3>
            <span className="text-[11px] text-amber-600 font-semibold">
              {pendingCount > 0 ? 'Needs attention' : 'All clear'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Today's Check-Ins</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{todayCheckIns}</h3>
            <span className="text-[11px] text-slate-500">{checkIns.length} all-time</span>
          </div>
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Expiring Soon */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Expiring Within 7 Days</h3>
            </div>
            <Link to="/admin/members" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {soonExpiring.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-300" />
              <p className="text-xs font-semibold">No memberships expiring soon</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {soonExpiring.map((m) => {
                const diff = Math.ceil((new Date(m.subscriptionEndDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={m.id} className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                        {(m.fullName || '?').charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{m.fullName}</span>
                        <span className="text-slate-500">{m.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${diff <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {diff === 0 ? 'Expires today' : `${diff}d left`}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.subscriptionEndDate}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Recent Payments</h3>
            </div>
            <Link to="/admin/payments" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-slate-400 space-y-2">
              <DollarSign className="w-8 h-8 text-slate-200" />
              <p className="text-xs font-semibold">No payments recorded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPayments.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 block">{p.memberName}</span>
                    <span className="text-slate-500">{p.paymentDate} · {p.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block">NPR {Number(p.amount).toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Renewal Reminders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Renewal Reminder Log</h3>
              <p className="text-[11px] text-slate-500">SMS / WhatsApp alerts sent to members</p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            + Add Member
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-slate-400 space-y-2">
            <Bell className="w-8 h-8 text-slate-200" />
            <p className="text-xs font-semibold">No reminders sent yet</p>
            <p className="text-[11px] text-slate-400">Send reminders from the Members Directory when subscriptions are near expiry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Expiry</th>
                  <th className="px-5 py-3">Days Left</th>
                  <th className="px-5 py-3">Channel</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminders.map((rem) => (
                  <tr key={rem.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-bold text-slate-900">{rem.memberName}</td>
                    <td className="px-5 py-3 text-slate-600">{rem.phone}</td>
                    <td className="px-5 py-3 font-medium">{rem.subscriptionEndDate}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {rem.daysRemaining}d
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{rem.channel}</td>
                    <td className="px-5 py-3 uppercase text-[10px] font-bold text-emerald-600">{rem.status}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => onSendReminder && onSendReminder(rem.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs border border-blue-200 transition inline-flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Resend</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
