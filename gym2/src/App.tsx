import React, { useState, useMemo, useEffect } from 'react';
import { Member, PaymentRecord, CheckInLog, RenewalReminder, GymStats, SubscriptionDuration } from './types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_CHECKINS, DURATION_PRICES } from './mockData';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberListTable } from './components/MemberListTable';
import { PaymentManagement } from './components/PaymentManagement';
import { MemberModal } from './components/MemberModal';
import { TuProjectReportModal } from './components/TuProjectReportModal';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { VercelGitModal } from './components/VercelGitModal';
import { AuthProvider, useAuth } from './context/AuthContext';

import {
  Dumbbell,
  Users,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  BookOpen,
  LogOut,
  Database,
  CheckCircle2,
  Sparkles,
  User,
  Github,
  Globe,
} from 'lucide-react';

function GymAppContent() {
  const { user, logout, isSupabaseConnected } = useAuth();

  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'payments' | 'member_portal'>('dashboard');

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [checkIns, setCheckIns] = useState<CheckInLog[]>(INITIAL_CHECKINS);
  const [reminders, setReminders] = useState<RenewalReminder[]>([
    {
      id: 'rem-1',
      memberId: 'm-1',
      memberName: 'Aarav Sharma',
      phone: '9841234567',
      email: 'aarav.sharma@gmail.com',
      subscriptionEndDate: '2026-08-10',
      daysRemaining: 5,
      status: 'sent',
      channel: 'SMS',
      lastSentAt: '2026-08-05 08:30 AM',
      reminderType: '7_days_notice',
    },
  ]);

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isTuReportModalOpen, setIsTuReportModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  // Derive current member for member dashboard based on logged-in user
  const currentMember = useMemo(() => {
    if (!user) return members[0];
    const found = members.find(
      (m) =>
        m.email.toLowerCase() === user.email.toLowerCase() ||
        (user.memberCode && m.memberCode === user.memberCode)
    );

    if (found) return found;

    // Create virtual member profile for newly registered user if not in mock array
    return {
      id: user.id || 'm-new',
      memberCode: user.memberCode || 'GYM-2026-999',
      fullName: user.fullName || 'Member',
      email: user.email,
      phone: user.phone || '9841000000',
      gender: 'Male',
      age: 25,
      emergencyContact: '9841000000 (Family)',
      joinDate: '2026-08-05',
      currentDuration: '3_months',
      subscriptionStartDate: '2026-08-05',
      subscriptionEndDate: '2026-11-05',
      paymentStatus: 'paid',
      amountDue: 0,
      lastPaymentDate: '2026-08-05',
      fitnessGoal: 'General Health & Fitness',
      notes: 'Registered via Supabase Auth Portal',
    } as Member;
  }, [user, members]);

  // Sync tab on login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('member_portal');
      }
    }
  }, [user]);

  // Compute stats
  const stats: GymStats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.paymentStatus === 'paid').length;
    const expiringThisWeek = members.filter((m) => {
      const end = new Date(m.subscriptionEndDate).getTime();
      const today = new Date('2026-08-05').getTime();
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    const overdueMembers = members.filter((m) => m.paymentStatus === 'overdue').length;
    const pendingPaymentsAmount = members.reduce((acc, curr) => acc + curr.amountDue, 0);
    const monthlyRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalMembers,
      activeMembers,
      expiringThisWeek,
      overdueMembers,
      pendingPaymentsAmount,
      monthlyRevenue,
    };
  }, [members, payments]);

  // Expiring and Overdue lists
  const expiringMembers = useMemo(() => {
    return members.filter((m) => {
      const end = new Date(m.subscriptionEndDate).getTime();
      const today = new Date('2026-08-05').getTime();
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [members]);

  const overdueMembers = useMemo(() => {
    return members.filter((m) => m.paymentStatus === 'overdue');
  }, [members]);

  // Handlers
  const handleSaveMember = (memberData: Partial<Member>) => {
    if (editingMember) {
      setMembers((prev) => prev.map((m) => (m.id === memberData.id ? ({ ...m, ...memberData } as Member) : m)));
    } else {
      const newMember = {
        ...memberData,
        id: `m-${Date.now()}`,
      } as Member;

      setMembers((prev) => [newMember, ...prev]);

      if (newMember.paymentStatus === 'paid') {
        const newPay: PaymentRecord = {
          id: `pay-${Date.now()}`,
          memberId: newMember.id,
          memberName: newMember.fullName,
          amount: DURATION_PRICES[newMember.currentDuration],
          duration: newMember.currentDuration,
          paymentDate: newMember.subscriptionStartDate,
          paymentMethod: 'eSewa',
          status: 'paid',
          receiptNumber: `REC-2026-${Math.floor(Math.random() * 8999) + 1000}`,
        };
        setPayments((prev) => [newPay, ...prev]);
      }
    }

    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleSendReminder = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const newRem: RenewalReminder = {
      id: `rem-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      phone: member.phone,
      email: member.email,
      subscriptionEndDate: member.subscriptionEndDate,
      daysRemaining: 5,
      status: 'sent',
      channel: 'SMS',
      lastSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      reminderType: '7_days_notice',
    };

    setReminders((prev) => [newRem, ...prev]);
    alert(`Automated SMS & Email Renewal Reminder sent to ${member.fullName} (${member.phone})!`);
  };

  const handleCheckInNow = (memberId: string) => {
    const member = members.find((m) => m.id === memberId) || currentMember;

    const newCheckIn: CheckInLog = {
      id: `chk-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      checkInTime: new Date().toLocaleString(),
      notes: 'Self-Service Check-In at Front Desk',
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);
    alert(`Gym check-in logged successfully for ${member.fullName}!`);
  };

  const handleAddPaymentRecord = (paymentData: Partial<PaymentRecord>) => {
    const newPay = {
      ...paymentData,
      id: `pay-${Date.now()}`,
    } as PaymentRecord;

    setPayments((prev) => [newPay, ...prev]);

    setMembers((prev) =>
      prev.map((m) => (m.id === newPay.memberId ? { ...m, paymentStatus: 'paid', amountDue: 0 } : m))
    );
  };

  const handleMemberPaymentSuccess = (payment: PaymentRecord, newDuration: SubscriptionDuration, newEndDate: string) => {
    setPayments((prev) => [payment, ...prev]);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === payment.memberId || (user && m.email.toLowerCase() === user.email.toLowerCase())
          ? {
              ...m,
              currentDuration: newDuration,
              subscriptionEndDate: newEndDate,
              paymentStatus: 'paid',
              amountDue: 0,
              lastPaymentDate: payment.paymentDate,
            }
          : m
      )
    );
  };

  // IF NOT AUTHENTICATED -> Display Login / SignUp Pages
  if (!user) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage
            onNavigateToSignUp={() => setAuthView('signup')}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        ) : (
          <SignUpPage
            onNavigateToLogin={() => setAuthView('login')}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}

        <SupabaseSetupModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      </>
    );
  }

  // IF AUTHENTICATED -> Display Role-Based Application UI
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased">
      
      {/* Top Main Navigation Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md font-bold">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                FitFlow
              </span>
              <span className="text-[10px] text-blue-400 uppercase font-mono tracking-widest block -mt-1">
                Gym Management
              </span>
            </div>
          </div>

          {/* Role Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {user.role === 'admin' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    activeTab === 'members'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Members Directory</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    activeTab === 'payments'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payments & Receipts</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('member_portal')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-sm flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>My Gym Membership Portal</span>
              </button>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
            
            {/* Supabase Status Indicator */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition hidden lg:flex items-center space-x-1.5"
              title="View Supabase Setup SQL"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px]">
                {isSupabaseConnected ? 'Supabase Connected' : 'Supabase Setup'}
              </span>
            </button>

            {/* Vercel & Git Deployment Button */}
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-slate-800 to-black hover:from-slate-700 hover:to-slate-900 text-white border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              title="Vercel & Git Migration Guide"
            >
              <Github className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Vercel & Git Guide</span>
            </button>

            {/* TU Documentation Button */}
            <button
              onClick={() => setIsTuReportModalOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">TU Docx Report</span>
            </button>

            {/* User Profile Badge & Logout */}
            <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
              <div className="flex items-center space-x-2 px-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {user.role}
                </span>
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                  {user.fullName.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={() => logout()}
                className="p-1.5 bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Logged in User Context Banner */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs text-slate-500">Authenticated Session via Supabase Auth</div>
              <div className="text-sm font-bold text-slate-900">
                {user.fullName} <span className="font-normal text-slate-500">({user.email})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold">
            {user.role === 'admin' ? (
              <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl">
                Full Admin Operational Access
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                Personal Member Portal ({currentMember.memberCode})
              </span>
            )}
          </div>
        </div>

        {/* Admin Views */}
        {user.role === 'admin' && activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            members={members}
            expiringMembers={expiringMembers}
            overdueMembers={overdueMembers}
            reminders={reminders}
            onSelectMember={(m) => {
              setActiveTab('members');
            }}
            onSendReminder={handleSendReminder}
            onOpenAddMemberModal={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
          />
        )}

        {user.role === 'admin' && activeTab === 'members' && (
          <MemberListTable
            members={members}
            onSelectMember={(m) => {
              // Edit or inspect member
            }}
            onOpenAddModal={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsMemberModalOpen(true);
            }}
          />
        )}

        {user.role === 'admin' && activeTab === 'payments' && (
          <PaymentManagement
            payments={payments}
            members={members}
            onAddPayment={handleAddPaymentRecord}
          />
        )}

        {/* Member View */}
        {user.role === 'member' && (
          <MemberDashboard
            member={currentMember}
            checkIns={checkIns}
            payments={payments}
            onCheckInNow={handleCheckInNow}
            onOpenReportModal={() => setIsTuReportModalOpen(true)}
            onPaymentSuccess={handleMemberPaymentSuccess}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-200">FitFlow Gym Management System</span>
            <span>•</span>
            <span>Supabase Role-Based Auth Portal</span>
          </div>
          <p className="text-slate-500">
            Tribhuvan University BIM Summer Project • 1M, 3M, 6M, 12M Subscription Plans.
          </p>
        </div>
      </footer>

      {/* Add / Edit Member Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        member={editingMember}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
      />

      {/* Tribhuvan University BIM Project Report Modal */}
      <TuProjectReportModal
        isOpen={isTuReportModalOpen}
        onClose={() => setIsTuReportModalOpen(false)}
      />

      {/* Supabase Database Setup Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Vercel & Git Deployment Guide Modal */}
      <VercelGitModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GymAppContent />
    </AuthProvider>
  );
}
