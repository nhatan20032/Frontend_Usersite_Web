import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Sparkles,
  Crown,
} from 'lucide-react';

const monthNamesVi = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const monthNamesEn = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export const TopHeader: React.FC = () => {
  const { currentUser, subscriptionTier, isPremium } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    openModal,
    toggleLeftSidebar,
    selectedDay,
    selectedMonth,
    selectedYear,
    selectToday,
    prevMonth,
    nextMonth,
    calendarView,
    setCalendarView,
  } = useApp();
  const { t, language } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  return (
    <header
      id="topHeader"
      className="h-16 border-b border-[#2A2B2D] bg-[#121314] px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0 z-30 relative select-none"
    >
      {/* 1. Left: Hamburger + Logo & Navigation Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Hamburger Drawer Toggle */}
        <button
          onClick={toggleLeftSidebar}
          className="p-2 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
          title="Thu gọn / Mở rộng bảng điều khiển"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Google Calendar Brand Logo */}
        <div className="flex items-center gap-2 mr-1 sm:mr-3">
          <div className="w-9 h-9 bg-[#1A73E8] text-white rounded-lg flex flex-col items-center justify-center shadow-md font-sans">
            <span className="text-[9px] font-semibold leading-none text-white/80 uppercase">T9</span>
            <span className="text-sm font-black leading-none">{selectedDay || 15}</span>
          </div>
          <div className="hidden xs:flex items-center gap-2">
            <span className="font-semibold text-lg tracking-tight text-[#E3E2E3]">Lịch</span>
            {isPremium ? (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                {subscriptionTier === 'VIP' ? 'VIP' : 'PRO'}
              </span>
            ) : null}
          </div>
        </div>

        {/* Navigation: Hôm nay + Chevrons + Month Label */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={selectToday}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#E3E2E3] border border-[#333538] hover:bg-[#28292A] rounded-md transition-colors cursor-pointer"
          >
            {t('calendar.todayBtn') || 'Hôm nay'}
          </button>

          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className="p-1.5 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
              title={t('calendar.prevMonth')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
              title={t('calendar.nextMonth')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm sm:text-base font-medium text-[#E3E2E3] ml-1 whitespace-nowrap">
            {language === 'vi'
              ? `${monthNames[selectedMonth]}, ${selectedYear}`
              : `${monthNames[selectedMonth]} ${selectedYear}`}
          </span>
        </div>
      </div>

      {/* 2. Center: Google Search Pill */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#9AA0A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.searchPlaceholder') || 'Tìm kiếm sự kiện, công việc...'}
            className="w-full bg-[#1F2021] border border-[#333538] focus:border-[#8AB4F8] text-[#E3E2E3] rounded-full pl-10 pr-4 py-2 text-xs placeholder-[#70757A] transition-all focus:outline-none focus:bg-[#28292A]"
          />
        </div>
      </div>

      {/* 3. Right: View switcher, Upgrade, Settings, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* View Switcher Dropdown / Toggle */}
        <div className="flex items-center bg-[#1F2021] border border-[#333538] rounded-md p-0.5 text-xs">
          <button
            onClick={() => setCalendarView('month')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
              calendarView === 'month'
                ? 'bg-[#28292A] text-[#8AB4F8] shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            {language === 'vi' ? 'Tháng' : 'Month'}
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium flex items-center gap-1 ${
              calendarView === 'week'
                ? 'bg-[#28292A] text-[#8AB4F8] shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            <span>{language === 'vi' ? 'Tuần' : 'Week'}</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded-full">VIP</span>
          </button>
        </div>

        {/* Upgrade Button for Free Users */}
        {!isPremium && (
          <button
            onClick={() => openModal('checkout')}
            className="hidden sm:flex items-center gap-1.5 bg-[#1A73E8] hover:bg-[#1B66CA] text-white font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'vi' ? 'Nâng cấp' : 'Upgrade'}</span>
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={() => openModal('settings')}
          className="p-2 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
          title={t('header.settingsTooltip')}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-[#1A73E8] text-white font-bold flex items-center justify-center text-xs ring-2 ring-[#333538] hover:ring-[#8AB4F8] transition-all cursor-pointer"
          >
            <span>{currentUser?.avatarInitial || 'AN'}</span>
          </button>

          <UserProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
};
