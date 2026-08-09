import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Palette, Smartphone, Crown, LogOut } from 'lucide-react';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const { openModal } = useApp();
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
      className="absolute right-0 mt-2 w-64 apple-glass-modal rounded-3xl p-2.5 space-y-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-2.5 border-b app-border space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs app-text-primary">{currentUser?.name || 'Nguyễn Văn An'}</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
            {currentRole}
          </span>
        </div>
        <p className="text-[11px] app-text-muted truncate">{currentUser?.email || 'an.nguyen@routinepulse.com'}</p>
      </div>

      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors"
      >
        <User className="w-4 h-4 text-slate-400" />
        <span>Hồ sơ cá nhân</span>
      </button>

      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors"
      >
        <Palette className="w-4 h-4 text-slate-400" />
        <span>Kho giao diện (Themes)</span>
      </button>

      <button
        onClick={() => {
          openModal('settings');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold app-text-primary hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors"
      >
        <Smartphone className="w-4 h-4 text-slate-400" />
        <span>Thiết bị đồng bộ</span>
      </button>

      <button
        onClick={() => {
          openModal('checkout');
          onClose();
        }}
        className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors"
      >
        <Crown className="w-4 h-4 text-amber-500" />
        <span>Nâng cấp gói Premium</span>
      </button>

      <div className="border-t app-border pt-1">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="w-full text-left p-2.5 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>
    </div>
  );
};
