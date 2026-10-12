'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Orders & Billing', href: '/orders' },
  { name: 'Van Sales', href: '/van-sales' },
  { name: 'Outlets & Beats', href: '/outlets' },
  { name: 'Purchase', href: '/purchase' },
  { name: 'Godown', href: '/godown' },
  { name: 'Delivery & Fleet', href: '/delivery' },
  { name: 'Schemes', href: '/schemes' },
  { name: 'Claims', href: '/claims' },
  { name: 'Collections', href: '/collections' },
  { name: 'Accounts', href: '/accounts' },
  { name: 'Field Team', href: '/field-team' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Menu Bar toggle button on small screens */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-[#031c19] text-[#00a693] rounded-lg shadow-md border border-[#0c332e] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`w-[200px] bg-[#031c19] text-[#a1b5b1] flex flex-col shrink-0 min-h-screen select-none font-sans z-40 transition-transform duration-200 lg:static fixed top-0 bottom-0 left-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#00a693] flex items-center justify-center font-bold text-[#031c19] text-sm">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="text-white font-bold text-[14px] tracking-tight">
            [Distributor] ERP
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0b3832] text-white font-semibold'
                    : 'text-[#9cb3af] hover:text-white hover:bg-[#082b26]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
