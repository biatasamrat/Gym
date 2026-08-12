import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'member';
  memberCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: 'admin' | 'member') => void;
  logout: () => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isSupabaseConnected: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fitflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged-in user as member for convenience in preview
    return {
      id: 'm-5',
      email: 'biatasamrat31@gmail.com',
      fullName: 'Kiran Shrestha',
      role: 'member',
      memberCode: 'FF-1005',
    };
  });

  const login = (email: string, role: 'admin' | 'member' = 'member') => {
    const newUser: User = {
      id: role === 'admin' ? 'admin-1' : `user-${Date.now()}`,
      email,
      fullName: role === 'admin' ? 'Gym Admin' : email.split('@')[0],
      role,
      memberCode: role === 'member' ? 'FF-1005' : undefined,
    };
    setUser(newUser);
    localStorage.setItem('fitflow_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isSupabaseConnected: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
