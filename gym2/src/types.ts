export type SubscriptionDuration = '1_month' | '3_months' | '6_months' | '12_months';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export type SubscriptionState = 'active' | 'expiring_soon' | 'expired';

export interface Member {
  id: string;
  memberCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  emergencyContact: string;
  joinDate: string; // YYYY-MM-DD
  currentDuration: SubscriptionDuration;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  paymentStatus: PaymentStatus;
  amountDue: number;
  lastPaymentDate?: string;
  fitnessGoal?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  duration: SubscriptionDuration;
  paymentDate: string;
  paymentMethod: 'eSewa' | 'Khalti' | 'Cash' | 'Bank Transfer' | 'Card';
  status: PaymentStatus;
  receiptNumber: string;
}

export interface CheckInLog {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string; // ISO string or formatted date
  notes?: string;
}

export interface RenewalReminder {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  email: string;
  subscriptionEndDate: string;
  daysRemaining: number;
  status: 'pending' | 'sent' | 'failed';
  channel: 'SMS' | 'Email' | 'In-App';
  lastSentAt?: string;
  reminderType: '7_days_notice' | '3_days_notice' | 'overdue_notice';
}

export interface GymStats {
  totalMembers: number;
  activeMembers: number;
  expiringThisWeek: number;
  overdueMembers: number;
  pendingPaymentsAmount: number;
  monthlyRevenue: number;
}
