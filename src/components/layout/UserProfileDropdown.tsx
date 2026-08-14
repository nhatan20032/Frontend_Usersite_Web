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
      showToast('Chuyển sang tài khoản FREE', 'Đang giả lập trải nghiệm Người dùng Miễn phí.', 'info');
    } else {
      setRole('PREMIUM_USER');
      upgradeToTier('PRO', 'Gói Chuyên Nghiệp (PRO)');
      showToast('Kích hoạt tài khoản PRO', 'Mở khóa toàn bộ đặc quyền Premium Pro!', 'success');
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 apple-glass-modal rounded-3xl p-2.5 space-y-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 border app-border"
    >
      {/* Account Info Header */}
      <div className="p-3 border-b app-border space-y-1 rounded-2xl bg-black/5 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs app-text-primary">{currentUser?.name || 'Nguyễn Văn An'}</span>
          {isPremium ? (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Crown className="w-2.5 h-2.5 fill-slate-950" />
              {subscriptionTier}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              FREE
            </span>
          )}
        </div>
        <p className="text-[11px] app-text-muted truncate">{currentUser?.email || 'an.nguyen@routinepulse.com'}</p>
        <div className="text-[10px] text-slate-500 pt-0.5">
          {isPremium
            ? `⭐ ${currentUser?.planName || 'Gói Pro'} (Đang kích hoạt)`
            : '🔒 Gói Miễn phí (Giới hạn 10 task, 5 routines)'}
        </div>
      </div>

      {/* Quick Demo Switcher between FREE & PRO */}
      <div className="p-1.5 border-b app-border">
        <button
          onClick={handleToggleDemoTier}
          className="w-full p-2 rounded-xl text-[11px] font-bold flex items-center justify-between bg-blue-500/10 text-blue-600 dark:text-sky-400 hover:bg-blue-500/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPremium ? 'Chuyển về Test FREE' : 'Kích hoạt Test PRO'}</span>
          </div>
          <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-md">Demo Mode</span>
        </button>
      </div>

      {/* Settings Navigation */}
      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <User className="w-4 h-4 text-slate-400" />
        <span>{t('modals.settings.tabProfile')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Palette className="w-4 h-4 text-slate-400" />
        <span>{t('modals.settings.tabAppearance')}</span>
      </button>

      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Smartphone className="w-4 h-4 text-slate-400" />
        <span>{t('modals.settings.tabDevices')}</span>
      </button>

      {/* Language Switcher Row */}
      <div className="p-2 border-t border-b app-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold app-text-primary">
          <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400 flex-shrink-0" />
          <span className="truncate">{t('common.language')}</span>
        </div>
        <div className="flex items-center apple-glass-pill p-0.5 rounded-xl text-[11px] border border-slate-300/80 dark:border-slate-700 shadow-xs flex-shrink-0">
          <button
            onClick={() => setLanguage('vi')}
            className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              language === 'vi'
                ? 'text-blue-600 dark:text-sky-400 bg-white dark:bg-slate-800 font-extrabold shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 font-bold'
            }`}
          >
            <span>🇻🇳</span>
            <span>VI</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              language === 'en'
                ? 'text-blue-600 dark:text-sky-400 bg-white dark:bg-slate-800 font-extrabold shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 font-bold'
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
          className="w-full text-left p-2.5 rounded-2xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Crown className="w-4 h-4 text-amber-500" />
          <span>{t('sidebar.upgradeBtn')}</span>
        </button>
      ) : (
        <div className="p-2 text-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tài khoản PRO đã mở khóa toàn bộ</span>
        </div>
      )}

      {/* Logout */}
      <div className="border-t app-border pt-1">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>{t('header.logout')}</span>
        </button>
      </div>
    </div>
  );
};
