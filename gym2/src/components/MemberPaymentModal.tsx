import React, { useState } from 'react';
import { Member, PaymentRecord, SubscriptionDuration } from '../types';
import { DURATION_PRICES } from '../mockData';
import { CreditCard, CheckCircle2, ShieldCheck, Download, Printer, QrCode, Smartphone, Sparkles, ArrowRight, X, Lock } from 'lucide-react';

interface MemberPaymentModalProps {
  isOpen: boolean;
  member: Member;
  onClose: () => void;
  onPaymentSuccess: (payment: PaymentRecord, newDuration: SubscriptionDuration, newEndDate: string) => void;
}

export const MemberPaymentModal: React.FC<MemberPaymentModalProps> = ({
  isOpen,
  member,
  onClose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'select_plan' | 'payment_details' | 'processing' | 'success'>('select_plan');
  
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(member.currentDuration || '3_months');
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti' | 'Card' | 'Bank Transfer'>('eSewa');
  
  // Payment Form Fields
  const [phoneNumber, setPhoneNumber] = useState<string>(member.phone || '9841234567');
  const [mpin, setMpin] = useState<string>('1234');
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('789');

  const [createdPayment, setCreatedPayment] = useState<PaymentRecord | null>(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');

  if (!isOpen) return null;

  const getAmountForDuration = (duration: SubscriptionDuration): number => {
    return DURATION_PRICES[duration] || 8000;
  };

  const computeNewEndDate = (duration: SubscriptionDuration): string => {
    const today = new Date();
    let monthsToAdd = 1;
    if (duration === '3_months') monthsToAdd = 3;
    if (duration === '6_months') monthsToAdd = 6;
    if (duration === '12_months') monthsToAdd = 12;

    const future = new Date(today.setMonth(today.getMonth() + monthsToAdd));
    return future.toISOString().split('T')[0];
  };

  const handleProcessPayment = () => {
    setStep('processing');

    const amount = getAmountForDuration(selectedDuration);
    const newEndDate = computeNewEndDate(selectedDuration);
    const todayStr = new Date().toISOString().split('T')[0];
    const receiptNo = `REC-2026-${Math.floor(Math.random() * 89999) + 10000}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      amount: amount,
      duration: selectedDuration,
      paymentDate: todayStr,
      paymentMethod: paymentMethod === 'Card' ? 'Card' : paymentMethod === 'Khalti' ? 'Khalti' : 'eSewa',
      status: 'paid',
      receiptNumber: receiptNo,
    };

    setTimeout(() => {
      setCreatedPayment(newPayment);
      setCalculatedEndDate(newEndDate);
      setStep('success');
      onPaymentSuccess(newPayment, selectedDuration, newEndDate);
    }, 1800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">FitFlow Subscription Gateway</h3>
              <p className="text-xs text-slate-400">Secure Member Payment Portal • Nepalese & Global Gateways</p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Select Plan Duration */}
        {step === 'select_plan' && (
          <div className="p-6 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
                Step 1 of 2
              </span>
              <h4 className="text-base font-bold text-slate-900">Select Membership Plan Duration</h4>
              <p className="text-xs text-slate-500">Choose your preferred renewal period to unlock gym facilities & AI Coaching.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: '1_month', label: '1 Month Membership', price: 3000, desc: 'Flexible monthly access' },
                { id: '3_months', label: '3 Months Quarter Plan', price: 8000, desc: 'Popular standard choice (Save 11%)' },
                { id: '6_months', label: '6 Months Half-Year', price: 15000, desc: 'Best value for serious athletes (Save 16%)' },
                { id: '12_months', label: '1 Year Annual Pass', price: 26000, desc: 'Maximum discount VIP plan (Save 27%)' },
              ].map((plan) => {
                const isSelected = selectedDuration === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedDuration(plan.id as SubscriptionDuration)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/30 text-blue-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900">{plan.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 block">
                        NPR {plan.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">{plan.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Total Order Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Member:</span>
                <span className="font-semibold text-slate-900">{member.fullName} ({member.memberCode})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Selected Duration:</span>
                <span className="font-semibold text-slate-900 uppercase">{selectedDuration.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Total Amount Payable:</span>
                <span className="font-extrabold text-blue-600 text-base">
                  NPR {getAmountForDuration(selectedDuration).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep('payment_details')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>Continue to Payment Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Select Gateway & Enter Details */}
        {step === 'payment_details' && (
          <div className="p-6 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
                Step 2 of 2
              </span>
              <h4 className="text-base font-bold text-slate-900">Choose Gateway & Authenticate</h4>
              <p className="text-xs text-slate-500">Select your digital wallet or card to authorize payment.</p>
            </div>

            {/* Gateway Provider Options */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'eSewa', name: 'eSewa Wallet', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                { id: 'Khalti', name: 'Khalti Wallet', color: 'border-purple-500 bg-purple-50 text-purple-900' },
                { id: 'Card', name: 'Card / Fonepay', color: 'border-blue-500 bg-blue-50 text-blue-900' },
              ].map((gw) => {
                const isSel = paymentMethod === gw.id;
                return (
                  <button
                    key={gw.id}
                    onClick={() => setPaymentMethod(gw.id as any)}
                    className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                      isSel ? `${gw.color} ring-2 ring-offset-1 ring-blue-400` : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {gw.name}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Gateway Form Input */}
            {paymentMethod === 'eSewa' && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>eSewa Digital Wallet Integration</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">eSewa Registered Mobile Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">MPIN / Security Password (Demo: 1234)</label>
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'Khalti' && (
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center space-x-2 text-purple-800 text-xs font-bold">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Khalti Digital Wallet Integration</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">Khalti ID / Phone</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">Third-Party OTP Pin</label>
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 text-xs font-bold">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Debit / Credit Card & Fonepay</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 block">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block">CVV Code</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit TLS Encryption • Instant Receipt Generation</span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setStep('select_plan')}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
              >
                Back
              </button>

              <button
                onClick={handleProcessPayment}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <span>Authorize NPR {getAmountForDuration(selectedDuration).toLocaleString()}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Processing Animation */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-600/30 border-t-blue-600 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Authorizing Payment...</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connecting with {paymentMethod} payment server and renewing subscription for member {member.fullName}...
            </p>
          </div>
        )}

        {/* STEP 4: Success Printable Receipt */}
        {step === 'success' && createdPayment && (
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-extrabold text-emerald-900">Payment Processed Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Subscription extended to <strong className="font-bold">{calculatedEndDate}</strong>. Receipt saved to history.
                </p>
              </div>
            </div>

            {/* Printable Receipt Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4 font-mono text-xs">
              <div className="text-center border-b border-dashed border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base font-sans">FITFLOW GYM MANAGEMENT</h3>
                <p className="text-[10px] text-slate-500">Official Membership Payment Receipt</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px]">
                  Receipt #: {createdPayment.receiptNumber}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Name:</span>
                  <span className="font-bold text-slate-900">{createdPayment.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Code:</span>
                  <span className="font-bold text-slate-900">{member.memberCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date Paid:</span>
                  <span>{createdPayment.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration Plan:</span>
                  <span className="font-bold uppercase">{createdPayment.duration.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valid Until:</span>
                  <span className="font-bold text-blue-600">{calculatedEndDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-bold">{createdPayment.paymentMethod}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-baseline font-sans">
                <span className="font-bold text-slate-900">Amount Paid:</span>
                <span className="text-xl font-extrabold text-emerald-600">NPR {createdPayment.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
              >
                Return to Member Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
