'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NewOrderModal } from '@/components/modals/NewOrderModal';
import { Loader2 } from 'lucide-react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, token, isLoading } = useAuth();

  const isLoginPage = pathname === '/login';

  // If on /login, render without sidebar and header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while determining auth state
  if (isLoading || !token) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#021311] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#00a693] mb-3" />
        <p className="text-sm text-[#8fa7a2]">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
      <NewOrderModal />
    </div>
  );
}
