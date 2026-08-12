import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'member';
  memberCode?: string;
}

export interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'member';
  memberCode?: string;
}

// Initial registered users database (Supabase table simulation / persistence)
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    email: 'admin@fitflow.com',
    password: 'admin123',
    fullName: 'Gym Admin',
    role: 'admin',
  },
  {
    email: 'admin@gmail.com',
    password: 'admin123',
    fullName: 'System Administrator',
    role: 'admin',
  },
  {
    email: 'biatasamrat31@gmail.com',
    password: 'member123',
    fullName: 'Kiran Shrestha',
    role: 'member',
    memberCode: 'FF-1005',
  },
  {
    email: 'aarav.sharma@gmail.com',
    password: 'member123',
    fullName: 'Aarav Sharma',
    role: 'member',
    memberCode: 'FF-1001',
  },
  {
    email: 'sita.adhikari@yahoo.com',
    password: 'member123',
    fullName: 'Sita Adhikari',
    role: 'member',
    memberCode: 'FF-1002',
  },
];

interface AuthContextType {
  user: User | null;
  loginWithCredentials: (email: string, pass: string) => { success: boolean; error?: string; user?: User };
  registerUser: (email: string, pass: string, fullName: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  isSupabaseConnected: boolean;
  accounts: UserAccount[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithCredentials: () => ({ success: false }),
  registerUser: () => ({ success: false }),
  logout: () => {},
  isSupabaseConnected: false,
  accounts: [],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('fitflow_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fitflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged-in user as member for preview convenience
    return {
      id: 'm-5',
      email: 'biatasamrat31@gmail.com',
      fullName: 'Kiran Shrestha',
      role: 'member',
      memberCode: 'FF-1005',
    };
  });

  const loginWithCredentials = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Search in user database (Supabase / Local DB)
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (!matchedAccount) {
      // Check if it's admin pattern or create on the fly if needed for fallback
      if (cleanEmail.includes('admin') && cleanPass === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: cleanEmail,
          fullName: 'Gym Admin',
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('fitflow_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }

      return { success: false, error: 'Account not found. Please check your email or register.' };
    }

    if (matchedAccount.password !== cleanPass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Role is automatically retrieved from the matched database record
    const loggedUser: User = {
      id: matchedAccount.role === 'admin' ? 'admin-1' : `user-${Date.now()}`,
      email: matchedAccount.email,
      fullName: matchedAccount.fullName,
      role: matchedAccount.role,
      memberCode: matchedAccount.memberCode || (matchedAccount.role === 'member' ? 'FF-1005' : undefined),
    };

    setUser(loggedUser);
    localStorage.setItem('fitflow_user', JSON.stringify(loggedUser));
    return { success: true, user: loggedUser };
  };

  const registerUser = (email: string, pass: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass || !fullName) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    const exists = accounts.some((acc) => acc.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Account already exists with this email address.' };
    }

    const isRoleAdmin = cleanEmail.includes('admin');
    const newAccount: UserAccount = {
      email: cleanEmail,
      password: cleanPass,
      fullName: fullName.trim(),
      role: isRoleAdmin ? 'admin' : 'member',
      memberCode: isRoleAdmin ? undefined : `FF-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updatedAccounts = [newAccount, ...accounts];
    setAccounts(updatedAccounts);
    localStorage.setItem('fitflow_accounts', JSON.stringify(updatedAccounts));

    const loggedUser: User = {
      id: newAccount.role === 'admin' ? 'admin-1' : `user-${Date.now()}`,
      email: newAccount.email,
      fullName: newAccount.fullName,
      role: newAccount.role,
      memberCode: newAccount.memberCode,
    };

    setUser(loggedUser);
    localStorage.setItem('fitflow_user', JSON.stringify(loggedUser));

    return { success: true, user: loggedUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitflow_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithCredentials,
        registerUser,
        logout,
        isSupabaseConnected: false,
        accounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

