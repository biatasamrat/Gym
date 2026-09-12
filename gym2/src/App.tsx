import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Member, PaymentRecord, CheckInLog, RenewalReminder, GymStats, SubscriptionDuration } from './types';
import { DURATION_PRICES } from './mockData';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberListTable } from './components/MemberListTable';
import { PaymentManagement } from './components/PaymentManagement';
import { MemberModal } from './components/MemberModal';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { LandingPage } from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

import {
  Dumbbell,
  Users,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  LogOut,
  Database,
  CheckCircle2,
  Sparkles,
  User,
  Globe,
} from 'lucide-react';

function GymAppContent() {
  const { user, logout, isSupabaseConnected, isLoading } = useAuth();
  const location = useLocation();

  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInLog[]>([]);
  const [reminders, setReminders] = useState<RenewalReminder[]>([]);
  
  const [isFetching, setIsFetching] = useState(false);

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Fetch Data from Supabase
  const fetchData = async () => {
    if (!user || !supabase) return;
    setIsFetching(true);

    try {
      // Fetch Profiles (Members)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesData) {
        setMembers(profilesData.map(p => ({
          id: p.id,
          memberCode: p.member_code,
          fullName: p.full_name,
          email: p.email,
          phone: p.phone,
          gender: p.gender,
          age: p.age,
          joinDate: p.join_date,
          subscriptionStartDate: p.subscription_start_date,
          subscriptionEndDate: p.subscription_end_date,
          currentDuration: p.current_duration as SubscriptionDuration,
          paymentStatus: p.payment_status,
          amountDue: p.amount_due,
          emergencyContact: p.emergency_contact,
          fitnessGoal: p.fitness_goal,
          notes: p.notes,
          lastPaymentDate: p.last_payment_date,
        })));
      }

      // Fetch Payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (paymentsData) {
        setPayments(paymentsData.map(p => ({
          id: p.id,
          memberId: p.member_id,
          memberName: p.member_name,
          amount: p.amount,
          duration: p.duration as SubscriptionDuration,
          paymentDate: p.payment_date,
          paymentMethod: p.payment_method,
          status: p.status,
          receiptNumber: p.receipt_number,
        })));
      }

      // Fetch Check-ins
      const { data: checkInsData } = await supabase
        .from('check_ins')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (checkInsData) {
        setCheckIns(checkInsData.map(c => ({
          id: c.id,
          memberId: c.member_id,
          memberName: c.member_name,
          checkInTime: c.check_in_time,
          notes: c.notes,
        })));
      }

      // Fetch Reminders
      const { data: remindersData } = await supabase
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (remindersData) {
        setReminders(remindersData.map(r => ({
          id: r.id,
          memberId: r.member_id,
          memberName: r.member_name,
          phone: r.phone,
          email: r.email,
          subscriptionEndDate: r.subscription_end_date,
          daysRemaining: r.days_remaining,
          status: r.status,
          channel: r.channel,
          lastSentAt: r.last_sent_at,
          reminderType: r.reminder_type,
        })));
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);


  // Derive current member for member dashboard based on logged-in user
  const currentMember = useMemo(() => {
    if (!user) return null;
    return members.find(m => m.id === user.id) || null;
  }, [user, members]);

  // Compute stats
  const stats: GymStats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.paymentStatus === 'paid').length;
    
    // Simplistic count of expiring this week
    const expiringThisWeek = members.filter((m) => {
      if (!m.subscriptionEndDate) return false;
      const end = new Date(m.subscriptionEndDate).getTime();
      const today = new Date().getTime();
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    const overdueMembers = members.filter((m) => m.paymentStatus === 'overdue').length;
    const pendingPaymentsAmount = members.reduce((acc, curr) => acc + (curr.amountDue || 0), 0);
    const monthlyRevenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return {
      totalMembers,
      activeSubscriptions: activeMembers,
      monthlyRevenue,
      pendingPayments: pendingPaymentsAmount,
      totalCheckInsToday: checkIns.filter(c => new Date(c.checkInTime).toDateString() === new Date().toDateString()).length,
    };
  }, [members, payments, checkIns]);

  // Expiring and Overdue lists
  const expiringMembers = useMemo(() => {
    return members.filter((m) => {
      if (!m.subscriptionEndDate) return false;
      const end = new Date(m.subscriptionEndDate).getTime();
      const today = new Date().getTime();
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [members]);

  const overdueMembers = useMemo(() => {
    return members.filter((m) => m.paymentStatus === 'overdue');
  }, [members]);

  // Handlers
  const handleSaveMember = async (memberData: Partial<Member>) => {
    if (!supabase) return;
    
    // In a real app, you might want to invite the user via auth.admin API 
    // to create their auth record first if they don't exist.
    // For this prototype, if it's an edit we just update the profile.
    if (editingMember) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: memberData.fullName,
          phone: memberData.phone,
          gender: memberData.gender,
          age: memberData.age,
          subscription_start_date: memberData.subscriptionStartDate,
          subscription_end_date: memberData.subscriptionEndDate,
          current_duration: memberData.currentDuration,
          payment_status: memberData.paymentStatus,
          amount_due: memberData.amountDue,
          emergency_contact: memberData.emergencyContact,
          fitness_goal: memberData.fitnessGoal,
          notes: memberData.notes,
        })
        .eq('id', memberData.id);

      if (!error) {
        setMembers((prev) => prev.map((m) => (m.id === memberData.id ? ({ ...m, ...memberData } as Member) : m)));
      } else {
         console.error(error);
         alert("Failed to update member.");
      }
    } else {
       // Cannot easily insert arbitrary users into profiles without auth user existing.
       // The proper way is letting members sign up. 
       // We'll show an alert for this flow.
       alert("To add a new member, please ask them to use the Sign Up page, then you can edit their profile here.");
    }

    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleSendReminder = async (memberId: string) => {
    if (!supabase) return;
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const { data, error } = await supabase.from('reminders').insert({
      member_id: member.id,
      member_name: member.fullName,
      phone: member.phone,
      email: member.email,
      subscription_end_date: member.subscriptionEndDate,
      days_remaining: 5,
      status: 'sent',
      channel: 'SMS',
      reminder_type: '7_days_notice',
      last_sent_at: new Date().toISOString()
    }).select().single();

    if (!error && data) {
      setReminders((prev) => [{
        id: data.id,
        memberId: data.member_id,
        memberName: data.member_name,
        phone: data.phone,
        email: data.email,
        subscriptionEndDate: data.subscription_end_date,
        daysRemaining: data.days_remaining,
        status: data.status,
        channel: data.channel,
        lastSentAt: data.last_sent_at,
        reminderType: data.reminder_type,
      }, ...prev]);
      alert(`Reminder sent to ${member.fullName}!`);
    } else {
      console.error(error);
    }
  };

  const handleCheckInNow = async (memberId: string) => {
    if (!supabase) return;
    const member = members.find((m) => m.id === memberId) || currentMember;
    if (!member) return;

    const { data, error } = await supabase.from('check_ins').insert({
      member_id: member.id,
      member_name: member.fullName,
      notes: 'Self-Service Check-In at Front Desk'
    }).select().single();

    if (!error && data) {
      setCheckIns((prev) => [{
         id: data.id,
         memberId: data.member_id,
         memberName: data.member_name,
         checkInTime: data.check_in_time,
         notes: data.notes
      }, ...prev]);
      alert(`Check-in logged for ${member.fullName}!`);
    } else {
       console.error(error);
    }
  };

  const handleAddPaymentRecord = async (paymentData: Partial<PaymentRecord>) => {
    if (!supabase) return;

    const { data, error } = await supabase.from('payments').insert({
      member_id: paymentData.memberId,
      member_name: paymentData.memberName,
      amount: paymentData.amount,
      duration: paymentData.duration,
      payment_date: paymentData.paymentDate,
      payment_method: paymentData.paymentMethod,
      status: paymentData.status,
      receipt_number: `REC-${Date.now()}`
    }).select().single();

    if (!error && data) {
      // Also update member status
      await supabase.from('profiles').update({
         payment_status: 'paid',
         amount_due: 0,
         last_payment_date: data.payment_date
      }).eq('id', data.member_id);

      fetchData(); // Refresh everything to be safe
    } else {
       console.error(error);
    }
  };

  const handleMemberPaymentSuccess = async (payment: PaymentRecord, newDuration: SubscriptionDuration, newEndDate: string) => {
    if (!supabase || !currentMember) return;

    const { error: payError } = await supabase.from('payments').insert({
      member_id: currentMember.id,
      member_name: currentMember.fullName,
      amount: payment.amount,
      duration: newDuration,
      payment_date: payment.paymentDate,
      payment_method: payment.paymentMethod,
      status: 'paid',
      receipt_number: `REC-${Date.now()}`
    });

    if (!payError) {
      await supabase.from('profiles').update({
         current_duration: newDuration,
         subscription_end_date: newEndDate,
         payment_status: 'paid',
         amount_due: 0,
         last_payment_date: payment.paymentDate
      }).eq('id', currentMember.id);
      
      fetchData();
      alert("Payment Successful!");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100">Loading Session...</div>;
  }

  // IF NOT AUTHENTICATED -> Display Login / SignUp Pages
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/admin" element={<LoginPage />} />
        <Route path="/login/member" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    location.pathname === '/admin/dashboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>

                <Link
                  to="/admin/members"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    location.pathname === '/admin/members'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Members Directory</span>
                </Link>

                <Link
                  to="/admin/payments"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                    location.pathname === '/admin/payments'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payments & Receipts</span>
                </Link>
              </>
            ) : (
              <Link
                to="/member/portal"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-sm flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>My Gym Membership Portal</span>
              </Link>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
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
        
        {/* Welcome Bar */}
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
              <div className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-sm font-bold text-slate-900">
                Welcome back, {user.fullName} <span className="font-normal text-slate-500">({user.email})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold">
            {user.role === 'admin' ? (
              <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl">
                Administrator
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                Member ID: {user.memberCode || 'Pending'}
              </span>
            )}
          </div>
        </div>

        {isFetching ? (
           <div className="text-center text-slate-500 py-12">Loading data...</div>
        ) : (
          <>
            <Routes>
              {user.role === 'admin' ? (
                <>
                  <Route path="/admin/dashboard" element={
                    <AdminDashboard
                      stats={stats}
                      members={members}
                      payments={payments}
                      checkIns={checkIns}
                      expiringMembers={expiringMembers}
                      overdueMembers={overdueMembers}
                      reminders={reminders}
                      onSelectMember={(m) => { /* handled via links now, or we can leave as is */ }}
                      onSendReminder={handleSendReminder}
                      onOpenAddMember={() => {
                        setEditingMember(null);
                        setIsMemberModalOpen(true);
                      }}
                      onOpenAddMemberModal={() => {
                        setEditingMember(null);
                        setIsMemberModalOpen(true);
                      }}
                    />
                  } />

                  <Route path="/admin/members" element={
                    <MemberListTable
                      members={members}
                      onSelectMember={(m) => {}}
                      onOpenAddModal={() => {
                        setEditingMember(null);
                        setIsMemberModalOpen(true);
                      }}
                      onEditMember={(m) => {
                        setEditingMember(m);
                        setIsMemberModalOpen(true);
                      }}
                    />
                  } />

                  <Route path="/admin/payments" element={
                    <PaymentManagement
                      payments={payments}
                      members={members}
                      onAddPayment={handleAddPaymentRecord}
                    />
                  } />
                  
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/member/portal" element={
                    currentMember ? (
                      <MemberDashboard
                        member={currentMember}
                        checkIns={checkIns}
                        payments={payments}
                        onCheckInNow={handleCheckInNow}
                        onPaymentSuccess={handleMemberPaymentSuccess}
                      />
                    ) : (
                      <div className="p-8 text-center text-slate-500">Loading Member Profile...</div>
                    )
                  } />
                  <Route path="*" element={<Navigate to="/member/portal" replace />} />
                </>
              )}
            </Routes>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-200">FitFlow Gym Management System</span>
          </div>
          <p className="text-slate-500">
            © {new Date().getFullYear()} FitFlow • 1M, 3M, 6M, 12M Subscription Plans
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
