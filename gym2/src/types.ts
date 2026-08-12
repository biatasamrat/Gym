export type SubscriptionDuration = '1_month' | '3_months' | '6_months' | '12_months';

export type PaymentMethod = 'eSewa' | 'Khalti' | 'Card' | 'Cash' | 'Bank Transfer';

export interface Member {
  id: string;
  memberCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  joinDate: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  currentDuration: SubscriptionDuration;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  amountDue: number;
  emergencyContact: string;
  fitnessGoal?: string;
  notes?: string;
  lastPaymentDate?: string;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  duration: SubscriptionDuration;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: 'paid' | 'pending' | 'failed';
  receiptNumber: string;
}

export interface CheckInLog {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  notes: string;
}

export interface RenewalReminder {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  email: string;
  subscriptionEndDate: string;
  daysRemaining: number;
  status: 'sent' | 'pending' | 'dismissed';
  channel: 'SMS' | 'Email' | 'WhatsApp';
  lastSentAt: string;
  reminderType: '7_days_notice' | '3_days_notice' | 'due_today' | 'overdue';
}

export interface GymStats {
  totalMembers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  pendingPayments: number;
  totalCheckInsToday: number;
}
