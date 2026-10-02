import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Palette, Smartphone, Crown, LogOut, Globe, Sparkles } from 'lucide-react';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { currentUser, subscriptionTier, isPremium, upgradeToTier, setRole, logout } = useAuth();
  const { openModal, showToast } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleDemoTier = () => {
    if (isPremium) {
      setRole('FREE_USER');
      upgradeToTier('FREE', 'Gói Miễn Phí');
      showToast('Tài khoản FREE', 'Đang giả lập trải nghiệm Người dùng Miễn phí.', 'info');
    } else {
      setRole('PREMIUM_USER');
      upgradeToTier('PRO', 'Gói Chuyên Nghiệp (PRO)');
      showToast('Kích hoạt PRO', 'Mở khóa đặc quyền gói Pro thành công!', 'success');
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-[#1F2021] border border-[#333538] rounded-xl p-2 space-y-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-[#E3E2E3]"
    >
      {/* Account Info Header */}
      <div className="p-3 border-b border-[#2A2B2D] space-y-1 rounded-lg bg-[#191A1B]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-[#E3E2E3]">{currentUser?.name || 'Nguyễn Văn An'}</span>
          {isPremium ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDD663]/20 text-[#FDD663] border border-[#FDD663]/40 flex items-center gap-1 shadow-xs">
              <Crown className="w-2.5 h-2.5" />
              {subscriptionTier}
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#28292A] text-[#9AA0A6] border border-[#333538]">
              FREE
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#9AA0A6] truncate">{currentUser?.email || 'an.nguyen@routinepulse.com'}</p>
        <div className="text-[10px] text-[#70757A] pt-0.5">
          {isPremium
            ? `⭐ ${currentUser?.planName || 'Gói Pro'} (Đang kích hoạt)`
            : '🔒 Gói Miễn phí (Giới hạn lưu trữ)'}
        </div>
      </div>

      {/* Quick Demo Switcher between FREE & PRO */}
      <div className="p-1 border-b border-[#2A2B2D]">
        <button
          onClick={handleToggleDemoTier}
          className="w-full p-2 rounded-lg text-[11px] font-semibold flex items-center justify-between bg-[#1A73E8]/10 text-[#8AB4F8] hover:bg-[#1A73E8]/20 transition-all cursor-pointer border border-[#1A73E8]/30"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPremium ? 'Chuyển về Test FREE' : 'Kích hoạt Test PRO'}</span>
          </div>
          <span className="text-[9px] bg-[#1A73E8] text-white px-1.5 py-0.5 rounded">Demo</span>
        </button>
      </div>

      {/* Settings Navigation with Contextual Tabs */}
      <button
        onClick={() => {
          openModal('settings', 'profile');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[#E3E2E3] hover:bg-[#28292A] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <User className="w-4 h-4 text-[#9AA0A6]" />
        <span>{t('modals.settings.tabProfile')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings', 'appearance');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[#E3E2E3] hover:bg-[#28292A] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Palette className="w-4 h-4 text-[#9AA0A6]" />
        <span>{t('modals.settings.tabAppearance')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings', 'devices');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[#E3E2E3] hover:bg-[#28292A] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Smartphone className="w-4 h-4 text-[#9AA0A6]" />
        <span>{t('modals.settings.tabDevices')}</span>
      </button>

      {/* Language Switcher Row */}
      <div className="p-2 border-t border-b border-[#2A2B2D] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#E3E2E3]">
          <Globe className="w-4 h-4 text-[#8AB4F8] shrink-0" />
          <span className="truncate">{t('common.language')}</span>
        </div>
        <div className="flex items-center bg-[#28292A] p-0.5 rounded-lg text-[11px] border border-[#333538] shrink-0">
          <button
            onClick={() => setLanguage('vi')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              language === 'vi'
                ? 'text-white bg-[#1A73E8] font-bold shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              language === 'en'
                ? 'text-white bg-[#1A73E8] font-bold shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPremium ? (
        <button
          onClick={() => {
            openModal('checkout');
            onClose();
          }}
          className="w-full text-left p-2 rounded-lg text-xs font-semibold text-[#FDD663] bg-[#FDD663]/10 hover:bg-[#FDD663]/20 flex items-center gap-2 transition-colors cursor-pointer border border-[#FDD663]/30"
        >
          <Crown className="w-4 h-4 text-[#FDD663]" />
          <span>{t('sidebar.upgradeBtn')}</span>
        </button>
      ) : (
        <div className="p-1.5 text-center text-[11px] font-medium text-[#81C995] flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đã mở khóa toàn bộ tính năng PRO</span>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-[#2A2B2D] pt-1">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="w-full text-left p-2 rounded-lg text-xs font-medium text-[#F28B82] hover:bg-[#F28B82]/15 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#F28B82]" />
          <span>{t('header.logout')}</span>
        </button>
      </div>
    </div>
  );
};
