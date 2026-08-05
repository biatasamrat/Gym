import React, { useState } from 'react';
import { PaymentRecord, Member } from '../types';
import { CreditCard, DollarSign, Download, Plus, CheckCircle, Search, FileText } from 'lucide-react';
import { DURATION_PRICES } from '../mockData';

interface PaymentManagementProps {
  payments: PaymentRecord[];
  members: Member[];
  onAddPayment: (payment: Partial<PaymentRecord>) => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  payments,
  members,
  onAddPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti' | 'Cash' | 'Bank Transfer' | 'Card'>('eSewa');
  const [customAmount, setCustomAmount] = useState<number>(4500);

  const filteredPayments = payments.filter(
    (p) =>
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    onAddPayment({
      memberId: member.id,
      memberName: member.fullName,
      amount: Number(customAmount),
      duration: member.currentDuration,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: 'paid',
      receiptNumber: `REC-2026-${Math.floor(Math.random() * 8999) + 1000}`
    });

    alert(`Payment recorded successfully for ${member.fullName}! Digital receipt generated.`);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Gym Subscription Payments & Digital Receipts</h2>
          <p className="text-xs text-slate-400 mt-1">Track eSewa, Khalti, Cash, and Bank Transfer subscription payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Record New Payment Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5 h-fit">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Record Subscription Payment</span>
          </h3>

          <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Member</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white font-medium"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.memberCode}) - {m.currentDuration.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white font-medium"
              >
                <option value="eSewa">eSewa Mobile Wallet</option>
                <option value="Khalti">Khalti Wallet</option>
                <option value="Cash">Cash at Front-Desk</option>
                <option value="Bank Transfer">Bank Transfer (NIBL/NABIL)</option>
                <option value="Card">POS Credit/Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Amount Paid (NPR)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md"
            >
              Record Payment & Issue Receipt
            </button>
          </form>
        </div>

        {/* Payments Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-base">Payment Receipts Log ({filteredPayments.length})</h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receipt or member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none w-48"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredPayments.map((pay) => (
              <div key={pay.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{pay.receiptNumber}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      {pay.paymentMethod}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Member: <span className="font-semibold text-slate-800">{pay.memberName}</span> | Plan: {pay.duration.replace('_', ' ')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm block">NPR {pay.amount.toLocaleString()}</span>
                  <span className="text-slate-400 text-[11px] block">{pay.paymentDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
