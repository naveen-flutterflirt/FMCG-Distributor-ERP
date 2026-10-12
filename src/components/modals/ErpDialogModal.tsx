'use client';

import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export interface DialogOptions {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export function ErpDialogModal({
  isOpen,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onClose,
}: DialogOptions) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'danger':
        return (
          <div className="w-10 h-10 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-[#ccfbf1] text-[#005f56] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header bar */}
        <div className="p-5 pb-3 flex items-start gap-3.5">
          {getIcon()}
          <div className="flex-1 pr-2">
            <h3 className="text-[15px] font-bold text-[#111827] tracking-tight">{title}</h3>
            <p className="text-[13px] text-[#4b5563] mt-1.5 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 rounded-md p-1 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-[6px] transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-1.5 text-[12px] font-semibold text-white rounded-[6px] transition-colors cursor-pointer shadow-xs ${
              type === 'danger'
                ? 'bg-[#dc2626] hover:bg-[#b91c1c]'
                : 'bg-[#005f56] hover:bg-[#004e46]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
