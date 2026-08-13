import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Edit, Trash2, Plus, Phone, Mail, CheckCircle2 } from 'lucide-react';

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

  const filtered = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Registered Gym Members</h3>
          <p className="text-xs text-slate-500">Manage member profiles, durations, and fitness goals</p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition shrink-0"
          >
            + Register Member
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-3">Code & Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Plan Duration</th>
              <th className="p-3">Valid Until</th>
              <th className="p-3">Payment</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <span className="font-extrabold text-slate-900 block">{m.fullName}</span>
                  <span className="text-[10px] text-blue-600 font-bold">{m.memberCode}</span>
                </td>
                <td className="p-3 space-y-0.5 text-slate-600">
                  <div>{m.phone}</div>
                  <div className="text-[10px] text-slate-400">{m.email}</div>
                </td>
                <td className="p-3 font-semibold uppercase">{m.currentDuration.replace('_', ' ')}</td>
                <td className="p-3 text-slate-900">{m.subscriptionEndDate}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      m.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {m.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEditMember && onEditMember(m)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMember && onDeleteMember(m.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
