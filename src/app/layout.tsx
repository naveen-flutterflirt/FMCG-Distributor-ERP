import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CrmProvider } from '@/context/CrmContext';
import { DashboardShell } from '@/components/layout/DashboardShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FMCG Distributor ERP | FlutterFlirt Enterprise',
  description:
    'One system for sales, route & van sales, schemes, warehouse, finance and field teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 flex">
        <AuthProvider>
          <CrmProvider>
            <DashboardShell>{children}</DashboardShell>
          </CrmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
