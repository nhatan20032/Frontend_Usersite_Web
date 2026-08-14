import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Calendar, Search, Plus, Settings, Crown, Sparkles } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { currentUser, subscriptionTier, isPremium } = useAuth();
  const { searchQuery, setSearchQuery, openModal } = useApp();
  const { t, language } = useLanguage();
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
            
            {/* Distinct Tier Badge */}
            {isPremium ? (
              <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-yellow-300/40">
                <Crown className="w-3 h-3 fill-slate-950 text-slate-950" />
                {subscriptionTier === 'VIP' ? 'VIP 👑' : 'PRO ⭐'}
              </span>
            ) : (
              <span className="apple-glass-pill text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                FREE
              </span>
            )}
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

      {/* Right Controls: Quick Create, Upgrade button, Settings & Account Dropdown */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Prominent Upgrade Button for Free Users */}
        {!isPremium && (
          <button
            onClick={() => openModal('checkout')}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-3 py-2 rounded-2xl text-xs shadow-md shadow-amber-500/20 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{language === 'vi' ? 'Nâng cấp PRO' : 'Upgrade PRO'}</span>
          </button>
        )}

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
            className={`w-9 h-9 rounded-2xl font-bold flex items-center justify-center text-xs shadow-md transition-all cursor-pointer border ${
              isPremium
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 border-amber-300/80 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-white/40 hover:ring-2 hover:ring-blue-500'
            }`}
          >
            <span>{currentUser?.avatarInitial || 'AN'}</span>
          </button>

          <UserProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
};
