import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Edit, Users } from 'lucide-react';

interface MemberListTableProps {
  members?: Member[];
  onOpenAddMember?: () => void;
  onOpenAddModal?: () => void;
  onSelectMember?: (member: Member) => void;
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (id: string) => void;
}

export const MemberListTable: React.FC<MemberListTableProps> = ({
  members = [],
  onOpenAddMember,
  onOpenAddModal,
  onSelectMember,
  onEditMember,
  onDeleteMember,
}) => {
  const [search, setSearch] = useState('');
  const handleAdd = onOpenAddMember || onOpenAddModal || (() => {});

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.memberCode || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.phone || '').includes(search)
    );
  });

  const statusColor = (status: string) => {
    if (status === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'overdue') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Members Directory</h3>
          <p className="text-xs text-slate-500 mt-0.5">{members.length} registered member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, code, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition shrink-0"
          >
            + Register Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Users className="w-10 h-10 text-slate-200" />
            <p className="text-sm font-semibold">
              {members.length === 0 ? 'No members registered yet' : 'No members match your search'}
            </p>
            {members.length === 0 && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                + Add First Member
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Valid Until</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {(m.fullName || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{m.fullName || '—'}</span>
                        <span className="text-[10px] text-blue-600 font-bold">{m.memberCode || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 space-y-0.5 text-slate-600">
                    <div>{m.phone || '—'}</div>
                    <div className="text-[10px] text-slate-400">{m.email || '—'}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold uppercase text-slate-700">
                    {m.currentDuration ? m.currentDuration.replace(/_/g, ' ') : <span className="text-slate-400 normal-case font-normal">Not set</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {m.subscriptionEndDate || <span className="text-slate-400">Not set</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColor(m.paymentStatus || 'pending')}`}>
                      {m.paymentStatus || 'pending'}
                    </span>
                    {(m.amountDue || 0) > 0 && (
                      <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Due: NPR {m.amountDue?.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right flex justify-end space-x-2">
                    <button
                      onClick={() => onEditMember && onEditMember(m)}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${m.fullName}?`)) {
                          onDeleteMember && onDeleteMember(m.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
