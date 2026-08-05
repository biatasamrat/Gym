import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  UserProfile,
  UserRole,
  getStoredLocalUser,
  setStoredLocalUser,
  findLocalUserByEmail,
  saveLocalCustomUser,
  getAllDemoProfiles,
} from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getStoredLocalUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check initial Supabase Session on Mount
  useEffect(() => {
    async function checkSession() {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const sbUser = session.user;
            
            // Fetch profile from 'profiles' table if it exists
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', sbUser.id)
              .single();

            if (profile) {
              const loadedUser: UserProfile = {
                id: profile.id,
                email: profile.email || sbUser.email || '',
                fullName: profile.full_name || sbUser.user_metadata?.full_name || 'FitFlow User',
                role: (profile.role as UserRole) || (sbUser.user_metadata?.role as UserRole) || 'member',
                memberCode: profile.member_code || sbUser.user_metadata?.member_code,
                phone: profile.phone || sbUser.user_metadata?.phone,
              };
              setUser(loadedUser);
              setStoredLocalUser(loadedUser);
            } else {
              // Fallback to user metadata
              const fallbackUser: UserProfile = {
                id: sbUser.id,
                email: sbUser.email || '',
                fullName: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
                role: (sbUser.user_metadata?.role as UserRole) || 'member',
                memberCode: sbUser.user_metadata?.member_code || 'GYM-2026-999',
                phone: sbUser.user_metadata?.phone,
              };
              setUser(fallbackUser);
              setStoredLocalUser(fallbackUser);
            }
          }
        } catch (err) {
          console.warn('Supabase session check error, falling back to local user store:', err);
        }
      }

      setIsLoading(false);
    }

    checkSession();

    // Listen for Supabase auth changes
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setStoredLocalUser(null);
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  // Login handler
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try real Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          // If Supabase returns error, check if password is correct for local demo accounts
          const localMatch = findLocalUserByEmail(trimmedEmail);
          if (localMatch) {
            setUser(localMatch);
            setStoredLocalUser(localMatch);
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const sbUser = data.user;
          // Try to get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sbUser.id)
            .single();

          const loadedUser: UserProfile = {
            id: sbUser.id,
            email: sbUser.email || trimmedEmail,
            fullName: profile?.full_name || sbUser.user_metadata?.full_name || 'Gym Member',
            role: (profile?.role as UserRole) || (sbUser.user_metadata?.role as UserRole) || 'member',
            memberCode: profile?.member_code || sbUser.user_metadata?.member_code || 'GYM-2026-100',
            phone: profile?.phone || sbUser.user_metadata?.phone,
          };

          setUser(loadedUser);
          setStoredLocalUser(loadedUser);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login error:', err);
      }
    }

    // 2. Demo / Fallback Authentication (Works out of the box)
    const localUser = findLocalUserByEmail(trimmedEmail);
    if (localUser) {
      setUser(localUser);
      setStoredLocalUser(localUser);
      return { success: true };
    }

    // Default auto-create or error if empty password
    if (password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters long.' };
    }

    // If new user email on demo mode, dynamically register them as a member
    const newDemoUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      fullName: trimmedEmail.split('@')[0].toUpperCase(),
      role: 'member',
      memberCode: `GYM-2026-${Math.floor(100 + Math.random() * 900)}`,
    };
    saveLocalCustomUser(newDemoUser);
    setUser(newDemoUser);
    setStoredLocalUser(newDemoUser);
    return { success: true };
  };

  // Sign Up handler
  const signUp = async ({
    fullName,
    email,
    password,
    role,
    phone,
  }: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const generatedMemberCode = `GYM-2026-${Math.floor(100 + Math.random() * 900)}`;

    // 1. If Supabase configured, attempt Supabase auth signUp
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              member_code: generatedMemberCode,
              phone: phone || '',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Explicitly insert into profiles table if RLS allows or via client
          try {
            await supabase.from('profiles').insert([
              {
                id: data.user.id,
                email: trimmedEmail,
                full_name: fullName,
                role: role,
                member_code: generatedMemberCode,
                phone: phone || '',
              },
            ]);
          } catch (pErr) {
            console.warn('Profile insert note:', pErr);
          }

          const newUser: UserProfile = {
            id: data.user.id,
            email: trimmedEmail,
            fullName,
            role,
            memberCode: generatedMemberCode,
            phone,
          };

          setUser(newUser);
          setStoredLocalUser(newUser);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Supabase signup failed' };
      }
    }

    // 2. Demo mode / Fallback SignUp
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      fullName,
      role,
      memberCode: generatedMemberCode,
      phone,
    };

    saveLocalCustomUser(newUser);
    setUser(newUser);
    setStoredLocalUser(newUser);
    return { success: true };
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase logout error:', e);
      }
    }
    setUser(null);
    setStoredLocalUser(null);
  };

  // Direct login as demo user
  const loginAsDemo = (profile: UserProfile) => {
    setUser(profile);
    setStoredLocalUser(profile);
  };

  // Update profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setStoredLocalUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        signUp,
        logout,
        loginAsDemo,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
