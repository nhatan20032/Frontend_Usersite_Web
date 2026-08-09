import React from 'react';
import { useApp } from '../../context/AppContext';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-blue-600 dark:text-sky-400" />;
        let badgeBg = 'bg-blue-500/15';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
          badgeBg = 'bg-emerald-500/15';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
          badgeBg = 'bg-amber-500/15';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
          badgeBg = 'bg-rose-500/15';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto apple-glass-modal p-4 rounded-3xl shadow-2xl border flex items-start gap-3 toast-enter transition-all"
          >
            <div className={`w-8 h-8 rounded-2xl ${badgeBg} flex items-center justify-center flex-shrink-0 shadow-xs`}>
              {icon}
            </div>
            <div className="flex-1 space-y-0.5 text-xs">
              <div className="font-bold app-text-primary">{toast.title}</div>
              <div className="app-text-secondary text-[11px] leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="app-text-muted hover:app-text-primary p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
