import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Calendar, Search, Sparkles, Crown, Plus, Settings } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { currentUser, currentRole, setRole } = useAuth();
  const { searchQuery, setSearchQuery, openModal } = useApp();
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
      <div className="hidden md:flex items-center max-w-md w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sự kiện, thói quen, công việc..."
            className="w-full apple-input pl-10 pr-4 py-2 text-xs placeholder-slate-400 dark:placeholder-slate-500 font-sans"
          />
        </div>
      </div>

      {/* Right Controls: Role Simulator & Account Dropdown */}
      <div className="flex items-center gap-2">
        {/* Role Simulator Switcher (Apple Glass Capsule) */}
        <div className="flex items-center apple-glass-pill p-1 rounded-2xl text-xs">
          <button
            onClick={() => setRole('FREE')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              currentRole === 'FREE'
                ? 'font-bold text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-white/20 shadow-xs'
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setRole('TRIAL')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              currentRole === 'TRIAL'
                ? 'font-bold text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-white/20 shadow-xs'
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Trial</span>
          </button>
          <button
            onClick={() => setRole('PREMIUM')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              currentRole === 'PREMIUM'
                ? 'font-bold text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-white/20 shadow-xs'
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-500" />
            <span>VIP</span>
          </button>
        </div>

        {/* Quick Create Action */}
        <button
          onClick={() => openModal('create')}
          className="hidden sm:flex items-center gap-1.5 apple-btn-primary font-bold px-3.5 py-2 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo mới</span>
        </button>

        {/* Settings Quick Icon */}
        <button
          onClick={() => openModal('settings')}
          className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-all cursor-pointer"
          title="Cài đặt & Giao diện"
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
