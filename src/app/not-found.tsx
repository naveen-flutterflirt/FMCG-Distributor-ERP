import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-14 h-14 rounded-full bg-[#ccfbf1] text-[#005f56] flex items-center justify-center font-bold text-xl mb-4">
        404
      </div>
      <h2 className="text-[20px] font-bold text-[#111827] tracking-tight">
        Operational Desk Not Found
      </h2>
      <p className="text-[13px] text-[#6b7280] max-w-md mt-1.5 leading-relaxed">
        The requested ERP route or module does not exist or has been relocated within the distributor portal.
      </p>
      <Link
        href="/"
        className="mt-5 px-4 py-2 bg-[#005f56] hover:bg-[#004e46] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
