'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (response.data) {
        login(response.data.token, response.data.user);
      } else {
        throw new Error('Authentication data not returned');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#021311] px-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00a693]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#005f56]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00a693] text-[#021311] font-bold shadow-lg shadow-[#00a693]/20 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            FMCG Distributor ERP
          </h1>
          <p className="text-sm text-[#9cb3af] mt-1">
            Enterprise Distribution & Sales Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#042420]/90 border border-[#0d443c] rounded-2xl p-7 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-[#829e98] mt-0.5">
              Enter your authorized admin credentials
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-900/30 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#c0d8d3] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#567a73]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#021815] border border-[#0e4840] rounded-lg text-sm text-white placeholder-[#45635c] focus:outline-none focus:border-[#00a693] focus:ring-1 focus:ring-[#00a693] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c0d8d3] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#567a73]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#021815] border border-[#0e4840] rounded-lg text-sm text-white placeholder-[#45635c] focus:outline-none focus:border-[#00a693] focus:ring-1 focus:ring-[#00a693] transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#00a693] hover:bg-[#009281] text-[#021311] font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00a693]/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter ERP Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
