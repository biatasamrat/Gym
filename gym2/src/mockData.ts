import { Member, PaymentRecord, CheckInLog, RenewalReminder } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    memberCode: 'GYM-2026-001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '9841234567',
    gender: 'Male',
    age: 26,
    emergencyContact: '9841000001 (Father)',
    joinDate: '2025-08-10',
    currentDuration: '6_months',
    subscriptionStartDate: '2026-02-10',
    subscriptionEndDate: '2026-08-10', // Expiring in 5 days
    paymentStatus: 'paid',
    amountDue: 0,
    lastPaymentDate: '2026-02-10',
    fitnessGoal: 'Hypertrophy & Strength',
    notes: 'Prefers morning workouts around 7:00 AM.'
  },
  {
    id: 'm-2',
    memberCode: 'GYM-2026-002',
    fullName: 'Priya Shrestha',
    email: 'priya.shrestha@hotmail.com',
    phone: '9801987654',
    gender: 'Female',
    age: 24,
    emergencyContact: '9801000002 (Mother)',
    joinDate: '2026-05-01',
    currentDuration: '3_months',
    subscriptionStartDate: '2026-05-01',
    subscriptionEndDate: '2026-08-01', // Overdue by 4 days
    paymentStatus: 'overdue',
    amountDue: 4500,
    lastPaymentDate: '2026-05-01',
    fitnessGoal: 'Fat Loss & Endurance',
    notes: 'Requested automated eSewa reminder.'
  },
  {
    id: 'm-3',
    memberCode: 'GYM-2026-003',
    fullName: 'Rohan Karki',
    email: 'rohan.karki@outlook.com',
    phone: '9813554433',
    gender: 'Male',
    age: 29,
    emergencyContact: '9813000003 (Spouse)',
    joinDate: '2026-07-01',
    currentDuration: '3_months',
    subscriptionStartDate: '2026-07-01',
    subscriptionEndDate: '2026-10-01',
    paymentStatus: 'paid',
    amountDue: 0,
    lastPaymentDate: '2026-07-01',
    fitnessGoal: 'General Fitness & Flexibility',
    notes: 'Attends late evening sessions.'
  },
  {
    id: 'm-4',
    memberCode: 'GYM-2026-004',
    fullName: 'Sujata Adhikari',
    email: 'sujata.adhikari@yahoo.com',
    phone: '9845112233',
    gender: 'Female',
    age: 28,
    emergencyContact: '9845000004 (Brother)',
    joinDate: '2026-02-15',
    currentDuration: '6_months',
    subscriptionStartDate: '2026-02-15',
    subscriptionEndDate: '2026-08-15', // Expiring in 10 days
    paymentStatus: 'pending',
    amountDue: 8000,
    lastPaymentDate: '2026-02-15',
    fitnessGoal: 'Postpartum Fitness & Core Strength',
    notes: 'Requested invoice via email.'
  },
  {
    id: 'm-5',
    memberCode: 'GYM-2026-005',
    fullName: 'Bibek Thapa',
    email: 'bibek.thapa@gmail.com',
    phone: '9860998877',
    gender: 'Male',
    age: 22,
    emergencyContact: '9860000005 (Father)',
    joinDate: '2026-07-15',
    currentDuration: '1_month',
    subscriptionStartDate: '2026-07-15',
    subscriptionEndDate: '2026-08-15', // Expiring in 10 days
    paymentStatus: 'paid',
    amountDue: 0,
    lastPaymentDate: '2026-07-15',
    fitnessGoal: 'Bodybuilding & Powerlifting',
    notes: 'College student discount applied.'
  },
  {
    id: 'm-6',
    memberCode: 'GYM-2026-006',
    fullName: 'Anjali Gurung',
    email: 'anjali.gurung@gmail.com',
    phone: '9818223344',
    gender: 'Female',
    age: 27,
    emergencyContact: '9818000006 (Sister)',
    joinDate: '2025-08-05',
    currentDuration: '12_months',
    subscriptionStartDate: '2025-08-05',
    subscriptionEndDate: '2026-08-05', // Expiring TODAY
    paymentStatus: 'pending',
    amountDue: 14000,
    lastPaymentDate: '2025-08-05',
    fitnessGoal: 'Weight Maintenance & Cardio',
    notes: 'Annual renewal due today.'
  },
  {
    id: 'm-7',
    memberCode: 'GYM-2026-007',
    fullName: 'Niraj Maharjan',
    email: 'niraj.maharjan@gmail.com',
    phone: '9841778899',
    gender: 'Male',
    age: 31,
    emergencyContact: '9841000007 (Spouse)',
    joinDate: '2026-01-10',
    currentDuration: '6_months',
    subscriptionStartDate: '2026-01-10',
    subscriptionEndDate: '2026-07-10', // Expired 26 days ago
    paymentStatus: 'overdue',
    amountDue: 8000,
    lastPaymentDate: '2026-01-10',
    fitnessGoal: 'Calisthenics & Agility',
    notes: 'Promises to renew by end of week.'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-101',
    memberId: 'm-1',
    memberName: 'Aarav Sharma',
    amount: 8000,
    duration: '6_months',
    paymentDate: '2026-02-10',
    paymentMethod: 'eSewa',
    status: 'paid',
    receiptNumber: 'REC-2026-8801'
  },
  {
    id: 'pay-102',
    memberId: 'm-2',
    memberName: 'Priya Shrestha',
    amount: 4500,
    duration: '3_months',
    paymentDate: '2026-05-01',
    paymentMethod: 'Khalti',
    status: 'paid',
    receiptNumber: 'REC-2026-8802'
  },
  {
    id: 'pay-103',
    memberId: 'm-3',
    memberName: 'Rohan Karki',
    amount: 4500,
    duration: '3_months',
    paymentDate: '2026-07-01',
    paymentMethod: 'Cash',
    status: 'paid',
    receiptNumber: 'REC-2026-8803'
  },
  {
    id: 'pay-104',
    memberId: 'm-5',
    memberName: 'Bibek Thapa',
    amount: 2000,
    duration: '1_month',
    paymentDate: '2026-07-15',
    paymentMethod: 'Bank Transfer',
    status: 'paid',
    receiptNumber: 'REC-2026-8804'
  }
];

export const INITIAL_CHECKINS: CheckInLog[] = [
  {
    id: 'chk-1',
    memberId: 'm-1',
    memberName: 'Aarav Sharma',
    checkInTime: '2026-08-05 07:15 AM',
    notes: 'Morning workout - Chest & Triceps'
  },
  {
    id: 'chk-2',
    memberId: 'm-3',
    memberName: 'Rohan Karki',
    checkInTime: '2026-08-05 08:30 AM',
    notes: 'Leg Day session'
  },
  {
    id: 'chk-3',
    memberId: 'm-5',
    memberName: 'Bibek Thapa',
    checkInTime: '2026-08-04 06:00 PM',
    notes: 'Evening Heavy Deadlifts'
  },
  {
    id: 'chk-4',
    memberId: 'm-1',
    memberName: 'Aarav Sharma',
    checkInTime: '2026-08-03 07:10 AM',
    notes: 'Back & Biceps'
  },
  {
    id: 'chk-5',
    memberId: 'm-4',
    memberName: 'Sujata Adhikari',
    checkInTime: '2026-08-02 05:30 PM',
    notes: 'Cardio & Abs'
  }
];

export const DURATION_PRICES: Record<string, number> = {
  '1_month': 2000,
  '3_months': 4500,
  '6_months': 8000,
  '12_months': 14000
};

export const DURATION_LABELS: Record<string, string> = {
  '1_month': '1 Month (NPR 2,000)',
  '3_months': '3 Months (NPR 4,500)',
  '6_months': '6 Months (NPR 8,000)',
  '12_months': '12 Months (NPR 14,000)'
};
