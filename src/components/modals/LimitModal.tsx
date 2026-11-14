import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Lock, Crown } from 'lucide-react';

export const LimitModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useApp();
  const { language, t } = useLanguage();

  if (activeModal !== 'limit') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] max-w-md w-full rounded-2xl p-6 space-y-4 text-center relative shadow-2xl text-[var(--text-primary)]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
          title={language === 'vi' ? 'Đóng' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-[#242527] text-[#FDD663] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.limit.title')}</h3>
          <p className="text-xs text-[var(--text-secondary)]">{t('modals.limit.desc')}</p>
        </div>

        <div className="bg-[var(--surface-canvas)] border border-[var(--border-grid)] p-4 rounded-xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>{language === 'vi' ? 'Tài khoản hiện tại (FREE):' : 'Current Tier (FREE):'}</span>
            <span className="font-semibold text-rose-400">{language === 'vi' ? 'Bị giới hạn' : 'Restricted'}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-emerald-400">
            <span>{language === 'vi' ? 'Quyền lợi Premium VIP:' : 'VIP Privileges:'}</span>
            <span>{language === 'vi' ? 'Mở khóa hoàn toàn' : 'Fully Unlocked'}</span>
          </div>
          <ul className="text-[11px] text-[var(--text-secondary)] space-y-1 list-disc list-inside pt-1 border-t border-[var(--border-grid)]">
            <li>{t('modals.checkout.feature1')}</li>
            <li>{t('modals.checkout.feature2')}</li>
            <li>{t('modals.checkout.feature3')}</li>
            <li>{t('modals.checkout.feature4')}</li>
          </ul>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={() => {
              closeModal();
              openModal('checkout');
            }}
            className="flex-1 bg-[var(--google-blue)] hover:bg-[#A8C8FF] text-[var(--surface-canvas)] font-semibold py-2.5 rounded-full text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{t('sidebar.upgradeBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
