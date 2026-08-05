import React, { useState } from 'react';
import { Member, CheckInLog, PaymentRecord } from '../types';
import { Search, Filter, Plus, FileText, Download, Phone, Calendar, ArrowUpDown, ChevronRight, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';

interface MemberListTableProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onOpenAddModal: () => void;
  onEditMember: (member: Member) => void;
}

export const MemberListTable: React.FC<MemberListTableProps> = ({
  members,
  onSelectMember,
  onOpenAddModal,
  onEditMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.memberCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDuration = durationFilter === 'all' || m.currentDuration === durationFilter;
    const matchesStatus = statusFilter === 'all' || m.paymentStatus === statusFilter;

    return matchesSearch && matchesDuration && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Member ID,Name,Phone,Gender,Join Date,Duration,Start Date,End Date,Payment Status,Amount Due\n'];
    const rows = filteredMembers.map(
      (m) =>
        `"${m.memberCode}","${m.fullName}","${m.phone}","${m.gender}","${m.joinDate}","${m.currentDuration}","${m.subscriptionStartDate}","${m.subscriptionEndDate}","${m.paymentStatus}","${m.amountDue}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitFlow_Gym_Members_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden space-y-4">
      
      {/* Search & Filter Header */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Gym Members Directory ({filteredMembers.length})</h2>
          <p className="text-xs text-slate-500">Duration-based subscription list with real-time status tracking</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48 sm:w-64"
            />
          </div>

          {/* Duration Filter */}
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Durations</option>
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="12_months">12 Months</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition text-xs font-semibold flex items-center space-x-1"
            title="Export CSV Report"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Register Member */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition flex items-center space-x-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-3.5 px-6">Member Info</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Duration Plan</th>
              <th className="py-3.5 px-4">Subscription Period</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No member records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition group">
                  
                  {/* Member Info */}
                  <td className="py-4 px-6">
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => onSelectMember(member)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center text-xs border border-slate-200 shrink-0">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {member.fullName}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">{member.memberCode}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4 text-slate-600">
                    <span className="block font-medium text-slate-800">{member.phone}</span>
                    <span className="text-[11px] text-slate-400">{member.email}</span>
                  </td>

                  {/* Duration Plan */}
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 font-semibold text-slate-700 rounded-lg text-xs capitalize border border-slate-200/60">
                      {member.currentDuration.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Subscription Period */}
                  <td className="py-4 px-4 text-slate-600">
                    <span className="block text-slate-800 font-medium">{member.subscriptionStartDate}</span>
                    <span className="text-[11px] font-bold text-blue-600 block mt-0.5">
                      Until: {member.subscriptionEndDate}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        member.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : member.paymentStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}
                    >
                      {member.paymentStatus === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {member.paymentStatus === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      <span>{member.paymentStatus}</span>
                    </span>
                    {member.amountDue > 0 && (
                      <span className="block text-[11px] font-bold text-rose-600 mt-1">
                        NPR {member.amountDue.toLocaleString()}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onSelectMember(member)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditMember(member)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 text-xs font-semibold rounded-lg transition"
                    >
                      Edit
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
