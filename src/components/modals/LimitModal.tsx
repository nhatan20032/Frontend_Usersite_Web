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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#1E1F20] border border-[#333538] max-w-md w-full rounded-2xl p-6 space-y-4 text-center relative shadow-2xl text-[#E3E2E3]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#9AA0A6] hover:text-[#E3E2E3] p-1.5 rounded-full hover:bg-[#28292A] transition-colors cursor-pointer"
          title={language === 'vi' ? 'Đóng' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-[#242527] text-[#FDD663] border border-[#333538] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#E3E2E3]">{t('modals.limit.title')}</h3>
          <p className="text-xs text-[#9AA0A6]">{t('modals.limit.desc')}</p>
        </div>

        <div className="bg-[#121314] border border-[#2A2B2D] p-4 rounded-xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#9AA0A6]">
            <span>{language === 'vi' ? 'Tài khoản hiện tại (FREE):' : 'Current Tier (FREE):'}</span>
            <span className="font-semibold text-rose-400">{language === 'vi' ? 'Bị giới hạn' : 'Restricted'}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-emerald-400">
            <span>{language === 'vi' ? 'Quyền lợi Premium VIP:' : 'VIP Privileges:'}</span>
            <span>{language === 'vi' ? 'Mở khóa hoàn toàn' : 'Fully Unlocked'}</span>
          </div>
          <ul className="text-[11px] text-[#9AA0A6] space-y-1 list-disc list-inside pt-1 border-t border-[#2A2B2D]">
            <li>{t('modals.checkout.feature1')}</li>
            <li>{t('modals.checkout.feature2')}</li>
            <li>{t('modals.checkout.feature3')}</li>
            <li>{t('modals.checkout.feature4')}</li>
          </ul>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={() => {
              activateFreeTrial();
              closeModal();
            }}
            className="flex-1 bg-[#28292A] hover:bg-[#333538] text-emerald-400 font-medium py-2.5 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Dùng thử 7 ngày' : '7-Day Trial'}</span>
          </button>
          <button
            onClick={() => {
              closeModal();
              openModal('checkout');
            }}
            className="flex-1 bg-[#8AB4F8] hover:bg-[#A8C8FF] text-[#121314] font-semibold py-2.5 rounded-full text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{t('sidebar.upgradeBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
