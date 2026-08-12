import React from 'react';
import { PaymentRecord } from '../types';
import { CreditCard, Download, CheckCircle2 } from 'lucide-react';

interface PaymentManagementProps {
  payments?: PaymentRecord[];
  members?: any[];
  onAddPayment?: (payment: any) => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ payments = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900">Subscription Payment Receipts & History</h3>
        <p className="text-xs text-slate-500">Track incoming revenue, eSewa, Khalti & card payments</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-3">Receipt #</th>
              <th className="p-3">Member</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Gateway</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                <td className="p-3 font-semibold text-slate-800">{p.memberName}</td>
                <td className="p-3 font-bold text-emerald-600">NPR {p.amount.toLocaleString()}</td>
                <td className="p-3 uppercase">{p.duration.replace('_', ' ')}</td>
                <td className="p-3 font-medium">{p.paymentMethod}</td>
                <td className="p-3 text-slate-500">{p.paymentDate}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
