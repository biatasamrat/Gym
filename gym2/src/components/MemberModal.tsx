import React, { useState } from 'react';
import { Member, SubscriptionDuration, PaymentStatus } from '../types';
import { DURATION_PRICES } from '../mockData';
import { X, UserPlus, Calendar, Phone, Mail, Award, DollarSign, ShieldAlert } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  member?: Member | null; // Null means Add New Mode
  onClose: () => void;
  onSave: (memberData: Partial<Member>) => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const isEditMode = !!member;

  const [fullName, setFullName] = useState(member?.fullName || '');
  const [email, setEmail] = useState(member?.email || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(member?.gender || 'Male');
  const [age, setAge] = useState<number>(member?.age || 25);
  const [emergencyContact, setEmergencyContact] = useState(member?.emergencyContact || '');
  const [duration, setDuration] = useState<SubscriptionDuration>(member?.currentDuration || '3_months');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(member?.paymentStatus || 'paid');
  const [fitnessGoal, setFitnessGoal] = useState(member?.fitnessGoal || 'Strength & Fitness');
  const [notes, setNotes] = useState(member?.notes || '');

  // Calculate End Date helper based on duration
  const getCalculatedEndDate = (startDateStr: string, dur: SubscriptionDuration) => {
    const start = new Date(startDateStr);
    let monthsToAdd = 1;
    if (dur === '3_months') monthsToAdd = 3;
    if (dur === '6_months') monthsToAdd = 6;
    if (dur === '12_months') monthsToAdd = 12;

    start.setMonth(start.getMonth() + monthsToAdd);
    return start.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please fill out member name and phone number.');
      return;
    }

    const todayStr = '2026-08-05';
    const startDate = member?.subscriptionStartDate || todayStr;
    const endDate = getCalculatedEndDate(startDate, duration);
    const amountDue = paymentStatus === 'paid' ? 0 : DURATION_PRICES[duration];

    onSave({
      id: member?.id,
      memberCode: member?.memberCode || `GYM-2026-00${Math.floor(Math.random() * 90) + 10}`,
      fullName,
      email,
      phone,
      gender,
      age: Number(age),
      emergencyContact,
      joinDate: member?.joinDate || todayStr,
      currentDuration: duration,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      paymentStatus,
      amountDue,
      fitnessGoal,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{isEditMode ? 'Edit Member Subscription' : 'Register New Gym Member'}</h3>
              <p className="text-xs text-slate-400">Duration-based pricing model (No tier distinctions)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Nepal 10-Digit) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9841234567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. member@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. 9841000000 (Father)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Gender & Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Age</label>
              <input
                type="number"
                min={12}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

          </div>

          {/* Subscription Duration Selection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Subscription Duration & Fee *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['1_month', '3_months', '6_months', '12_months'] as SubscriptionDuration[]).map((dur) => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`p-3 rounded-xl border text-center text-xs transition font-semibold ${
                    duration === dur
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold capitalize">{dur.replace('_', ' ')}</span>
                  <span className="block text-[11px] opacity-80 mt-0.5">
                    NPR {DURATION_PRICES[dur].toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
              >
                <option value="paid">Paid (Receipt Cleared)</option>
                <option value="pending">Pending Payment</option>
                <option value="overdue">Overdue / Lapsed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fitness Goal
              </label>
              <input
                type="text"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                placeholder="e.g. Strength Training & Fat Loss"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-md"
            >
              {isEditMode ? 'Save Member Changes' : 'Register Member & Generate Receipt'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
