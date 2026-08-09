import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Lock, Sparkles, Crown } from 'lucide-react';

export const LimitModal: React.FC = () => {
  const { activateFreeTrial } = useAuth();
  const { activeModal, closeModal, openModal } = useApp();
  const { language, t } = useLanguage();

  if (activeModal !== 'limit') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-4 text-center relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold app-text-primary">{t('modals.limit.title')}</h3>
          <p className="text-xs app-text-muted">{t('modals.limit.desc')}</p>
        </div>

        <div className="apple-glass-pill p-4 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>{language === 'vi' ? 'Tài khoản hiện tại (FREE):' : 'Current Tier (FREE):'}</span>
            <span className="font-bold text-rose-500 dark:text-rose-400">{language === 'vi' ? 'Bị giới hạn' : 'Restricted'}</span>
          </div>
          <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
            <span>{language === 'vi' ? 'Quyền lợi Premium VIP:' : 'VIP Privileges:'}</span>
            <span>{language === 'vi' ? 'Mở khóa hoàn toàn' : 'Fully Unlocked'}</span>
          </div>
          <ul className="text-[11px] app-text-secondary space-y-1 list-disc list-inside pt-1 border-t app-border">
            <li>{t('modals.checkout.feature1')}</li>
            <li>{t('modals.checkout.feature2')}</li>
            <li>{t('modals.checkout.feature3')}</li>
            <li>{t('modals.checkout.feature4')}</li>
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
            <span>{language === 'vi' ? 'Dùng thử 7 ngày' : '7-Day Trial'}</span>
          </button>
          <button
            onClick={() => {
              closeModal();
              openModal('checkout');
            }}
            className="flex-1 apple-btn-primary font-bold py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{t('sidebar.upgradeBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
