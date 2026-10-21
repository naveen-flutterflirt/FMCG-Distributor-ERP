'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Store,
  ArrowDownToLine,
  Warehouse,
  Send,
  BadgePercent,
  FileCheck2,
  HandCoins,
  Receipt,
  Users2,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders & Billing', href: '/orders', icon: ShoppingCart },
  { name: 'Van Sales', href: '/van-sales', icon: Truck },
  { name: 'Outlets & Beats', href: '/outlets', icon: Store },
  { name: 'Purchase', href: '/purchase', icon: ArrowDownToLine },
  { name: 'Godown', href: '/godown', icon: Warehouse },
  { name: 'Delivery & Fleet', href: '/delivery', icon: Send },
  { name: 'Schemes', href: '/schemes', icon: BadgePercent },
  { name: 'Claims', href: '/claims', icon: FileCheck2 },
  { name: 'Collections', href: '/collections', icon: HandCoins },
  { name: 'Accounts', href: '/accounts', icon: Receipt },
  { name: 'Field Team', href: '/field-team', icon: Users2 },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
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
        className={`w-[220px] bg-[#031c19] text-[#a1b5b1] flex flex-col shrink-0 min-h-screen select-none font-sans z-40 transition-transform duration-200 lg:static fixed top-0 bottom-0 left-0 border-r border-[#082e28] ${
          mobileMenuOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 gap-2.5 border-b border-[#082e28]">
          <div className="w-8 h-8 rounded-lg bg-[#00a693] flex items-center justify-center font-bold text-[#031c19] shadow-sm shadow-[#00a693]/30">
            <ShieldCheck className="w-5 h-5 text-[#031c19]" />
          </div>
          <div>
            <div className="text-white font-bold text-[14px] leading-tight tracking-tight">
              FMCG Distro
            </div>
            <div className="text-[10px] text-[#00a693] font-medium tracking-wide uppercase">
              Enterprise ERP
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                  isActive
                    ? 'bg-[#00a693] text-[#021815] font-semibold shadow-sm'
                    : 'text-[#9cb3af] hover:text-white hover:bg-[#072d27]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#021815] stroke-[2.5]'
                      : 'text-[#5f8780] group-hover:text-[#00a693]'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Section at the Bottom */}
        <div className="p-3 border-t border-[#082e28] bg-[#021614]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#052520] border border-[#0d3d34]">
            {/* User Details */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#00a693]/20 border border-[#00a693]/40 flex items-center justify-center text-[#00a693] font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.name || 'Super Admin'}
                </p>
                <p className="text-[10px] text-[#7fa39b] truncate leading-tight mt-0.5">
                  {user?.email || 'admin@gmail.com'}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Logout from ERP"
              className="p-1.5 text-[#8fa7a2] hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
