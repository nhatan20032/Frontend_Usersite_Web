import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import type { ToastNotification } from '../../types';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface ToastItemProps {
  toast: ToastNotification;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleDismiss]);

  let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;
  let badgeBg = 'bg-sky-500/10 border-sky-500/20';

  if (toast.type === 'success') {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    badgeBg = 'bg-emerald-500/10 border-emerald-500/20';
  } else if (toast.type === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
    badgeBg = 'bg-amber-500/10 border-amber-500/20';
  } else if (toast.type === 'error') {
    icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
    badgeBg = 'bg-rose-500/10 border-rose-500/20';
  }

  return (
    <div
      className={`pointer-events-auto bg-[#1E1F22] border border-[#2B2D31] text-[#E3E2E3] p-3.5 rounded-xl shadow-2xl flex items-start gap-3 transition-all ${
        isExiting ? 'toast-exit' : 'toast-enter'
      }`}
    >
      <div className={`w-7 h-7 rounded-lg border ${badgeBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-xs">
        <div className="font-medium text-[#E3E2E3] truncate">{toast.title}</div>
        <div className="text-[#909094] text-[11px] leading-relaxed mt-0.5 break-words">{toast.message}</div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Close notification"
        className="text-[#909094] hover:text-[#E3E2E3] p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
