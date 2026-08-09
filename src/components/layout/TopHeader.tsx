import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Calendar, Search, Sparkles, Crown, Plus, Settings } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { currentUser, currentRole, setRole } = useAuth();
  const { searchQuery, setSearchQuery, openModal } = useApp();
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <header id="topHeader" className="h-16 border-b app-border px-4 sm:px-6 flex items-center justify-between gap-4 apple-glass-surface flex-shrink-0 z-30 relative">
      {/* Left Logo & Branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight app-text-primary">RoutinePulse</span>
            <span className="apple-glass-pill text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {currentRole}
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar (Apple Glass Capsule) */}
      <div className="hidden md:flex items-center flex-1 min-w-0 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
            className="w-full apple-input pl-10 pr-4 py-2 text-xs placeholder-slate-400 dark:placeholder-slate-500 font-sans"
          />
        </div>
      </div>

      {/* Right Controls: Role Simulator, Settings & Account Dropdown */}
      <div className="flex items-center gap-2 flex-shrink-0">


        {/* Role Simulator Switcher (Apple Glass Capsule) */}
        <div className="hidden lg:flex items-center apple-glass-pill p-1 rounded-2xl text-xs border border-slate-300/80 dark:border-slate-700 shadow-xs flex-shrink-0">
          <button
            onClick={() => setRole('FREE')}
            className={`min-w-[68px] text-center px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              currentRole === 'FREE'
                ? 'font-extrabold text-blue-600 dark:text-sky-400 bg-white dark:bg-slate-800 shadow-sm border border-black/10 dark:border-white/10'
                : 'font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10'
            }`}
          >
            {t('common.free')}
          </button>
          <button
            onClick={() => setRole('TRIAL')}
            className={`min-w-[80px] text-center px-2.5 py-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              currentRole === 'TRIAL'
                ? 'font-extrabold text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-500/40 shadow-sm'
                : 'font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-900 dark:hover:text-emerald-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{t('common.trial')}</span>
          </button>
          <button
            onClick={() => setRole('PREMIUM')}
            className={`min-w-[76px] text-center px-2.5 py-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              currentRole === 'PREMIUM'
                ? 'font-extrabold text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/90 border border-amber-500/40 shadow-sm'
                : 'font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 hover:text-amber-950 dark:hover:text-amber-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>{t('common.vip')}</span>
          </button>
        </div>

        {/* Quick Create Action */}
        <button
          onClick={() => openModal('create')}
          className="hidden sm:flex items-center justify-center gap-1.5 apple-btn-primary font-bold min-w-[88px] px-3 py-2 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{t('header.quickCreate')}</span>
        </button>

        {/* Settings Quick Icon */}
        <button
          onClick={() => openModal('settings')}
          className="p-2.5 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-sky-400 hover:bg-blue-500/10 rounded-2xl transition-all cursor-pointer"
          title={t('header.settingsTooltip')}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20 border border-white/40 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
          >
            <span>{currentUser?.avatarInitial || 'AN'}</span>
          </button>

          <UserProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
};

