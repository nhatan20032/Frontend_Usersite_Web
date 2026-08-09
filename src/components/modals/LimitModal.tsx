import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Lock, Sparkles, Crown } from 'lucide-react';

export const LimitModal: React.FC = () => {
  const { activateFreeTrial } = useAuth();
  const { activeModal, closeModal, openModal } = useApp();

  if (activeModal !== 'limit') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-4 text-center relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 app-text-muted hover:app-text-primary p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold app-text-primary">Tính năng giới hạn gói FREE</h3>
          <p className="text-xs app-text-muted">Tính năng này yêu cầu quyền tài khoản Premium.</p>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Tài khoản hiện tại (FREE):</span>
            <span className="font-bold text-rose-500 dark:text-rose-400">Bị giới hạn</span>
          </div>
          <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
            <span>Quyền lợi Premium VIP:</span>
            <span>Mở khóa hoàn toàn</span>
          </div>
          <ul className="text-[11px] app-text-secondary space-y-1 list-disc list-inside pt-1 border-t app-border">
            <li>Đồng bộ không giới hạn thiết bị & Offline Mode</li>
            <li>Bản đồ AI tính thời gian di chuyển chuẩn xác</li>
            <li>Mở khóa toàn bộ kho Theme Tết, Giáng Sinh, Anime</li>
            <li>Không giới hạn thói quen & lưu trữ báo cáo trọn đời</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              activateFreeTrial();
              closeModal();
            }}
            className="flex-1 apple-glass-pill hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dùng thử 7 ngày</span>
          </button>
          <button
            onClick={() => {
              closeModal();
              openModal('checkout');
            }}
            className="flex-1 apple-btn-primary font-bold py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Nâng cấp VIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
