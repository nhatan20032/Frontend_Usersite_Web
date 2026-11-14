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
  const { currentUser, subscriptionTier, isPremium, logout } = useAuth();
  const { openModal } = useApp();
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


  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-xl p-2 space-y-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-[var(--text-primary)]"
    >
      {/* Account Info Header */}
      <div className="p-3 border-b border-[var(--border-grid)] space-y-1 rounded-lg bg-[#191A1B]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-[var(--text-primary)]">{currentUser?.name || 'Người dùng'}</span>
          {isPremium ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDD663]/20 text-[#FDD663] border border-[#FDD663]/40 flex items-center gap-1 shadow-xs">
              <Crown className="w-2.5 h-2.5" />
              {subscriptionTier}
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-container-high)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              FREE
            </span>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] truncate">{currentUser?.email || 'an.nguyen@routinepulse.com'}</p>
        <div className="text-[11px] text-[var(--text-muted)] pt-0.5">
          {isPremium
            ? `⭐ ${currentUser?.planName || 'Gói Pro'} (Đang kích hoạt)`
            : '🔒 Gói Miễn phí (Giới hạn lưu trữ)'}
        </div>
      </div>

      <div className="p-1 border-b border-[var(--border-grid)]">

      </div>

      {/* Settings Navigation with Contextual Tabs */}
      <button
        onClick={() => {
          openModal('settings', 'profile');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <User className="w-4 h-4 text-[var(--text-secondary)]" />
        <span>{t('modals.settings.tabProfile')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings', 'appearance');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Palette className="w-4 h-4 text-[var(--text-secondary)]" />
        <span>{t('modals.settings.tabAppearance')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings', 'devices');
          onClose();
        }}
        className="w-full text-left p-2 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Smartphone className="w-4 h-4 text-[var(--text-secondary)]" />
        <span>{t('modals.settings.tabDevices')}</span>
      </button>

      {/* Language Switcher Row */}
      <div className="p-2 border-t border-b border-[var(--border-grid)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
          <Globe className="w-4 h-4 text-[var(--google-blue)] shrink-0" />
          <span className="truncate">{t('common.language')}</span>
        </div>
        <div className="flex items-center bg-[var(--surface-container-high)] p-0.5 rounded-lg text-[11px] border border-[var(--border-subtle)] shrink-0">
          <button
            onClick={() => setLanguage('vi')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              language === 'vi'
                ? 'text-white bg-[var(--google-blue-primary)] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              language === 'en'
                ? 'text-white bg-[var(--google-blue-primary)] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
      <div className="border-t border-[var(--border-grid)] pt-1">
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
