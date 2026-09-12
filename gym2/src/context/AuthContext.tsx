import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as AuthUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'member';
  memberCode?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithCredentials: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  registerUser: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  isSupabaseConnected: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithCredentials: async () => ({ success: false }),
  registerUser: async () => ({ success: false }),
  logout: () => {},
  isSupabaseConnected: isSupabaseConfigured,
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the extended profile data from the profiles table
  const fetchProfile = async (authUser: AuthUser): Promise<User | null> => {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, member_code')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role as 'admin' | 'member',
        memberCode: data.member_code,
      };
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && mounted) {
        const profile = await fetchProfile(session.user);
        if (mounted) setUser(profile);
      }
      if (mounted) setIsLoading(false);
    }

    getInitialSession();

    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const loginWithCredentials = async (email: string, pass: string) => {
    if (!supabase) return { success: false, error: 'Supabase is not connected. Check .env' };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw error;
      
      if (data.user) {
        const profile = await fetchProfile(data.user);
        return { success: true, user: profile || undefined };
      }
      
      return { success: false, error: 'Unknown error occurred during login.' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const registerUser = async (email: string, pass: string, fullName: string) => {
    if (!supabase) return { success: false, error: 'Supabase is not connected. Check .env' };

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
         return { success: false, error: 'Signup succeeded but no user was returned.' };
      }

      // 2. Create the profile record
      const memberCode = `FF-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: 'member', // Default to member. Promote to admin via SQL.
        member_code: memberCode,
        payment_status: 'pending',
        amount_due: 0
      });

      if (profileError) {
         console.error('Profile creation error:', profileError);
         // Note: The auth user exists, but profile failed. 
         // In a real app, you might want to handle this edge case more robustly.
         return { success: false, error: 'Account created, but failed to setup profile.' };
      }

      const profile: User = {
        id: authData.user.id,
        email,
        fullName,
        role: 'member',
        memberCode
      };

      // Since we just signed up, auth state change will trigger SIGNED_IN.
      // But we can eagerly set it here too.
      setUser(profile);
      
      return { success: true, user: profile };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithCredentials,
        registerUser,
        logout,
        isSupabaseConnected: isSupabaseConfigured,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
