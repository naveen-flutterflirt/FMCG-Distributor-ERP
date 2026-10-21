'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { UserProfile, authApi } from '@/lib/api';

export type User = UserProfile;

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage on mount
    const savedToken = localStorage.getItem('fmcg_auth_token');
    const savedUser = localStorage.getItem('fmcg_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('fmcg_auth_token');
        localStorage.removeItem('fmcg_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === '/login';
      if (!token && !isLoginPage) {
        router.replace('/login');
      } else if (token && isLoginPage) {
        router.replace('/');
      }
    }
  }, [token, isLoading, pathname, router]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('fmcg_auth_token', newToken);
    localStorage.setItem('fmcg_auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    router.replace('/');
  };

  const logout = () => {
    localStorage.removeItem('fmcg_auth_token');
    localStorage.removeItem('fmcg_auth_user');
    setToken(null);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
