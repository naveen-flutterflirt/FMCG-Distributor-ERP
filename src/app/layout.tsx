import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CrmProvider } from '@/context/CrmContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NewOrderModal } from '@/components/modals/NewOrderModal';

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
        <CrmProvider>
          {/* Main App Container */}
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
                {children}
              </main>
            </div>
          </div>
          <NewOrderModal />
        </CrmProvider>
      </body>
    </html>
  );
}
