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
  Calendar,
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

const yearsList = Array.from({ length: 16 }, (_, i) => 2020 + i); // 2020 to 2035

export const TopHeader: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    openModal,
    toggleLeftSidebar,
    selectedDay,
    selectedMonth,
    selectedYear,
    selectToday,
    selectDate,
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
      className="h-14 border-b border-[#2A2B2D] bg-[#121314] px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0 z-30 relative select-none"
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

        {/* Calendar Brand Logo */}
        <div className="flex items-center gap-2.5 mr-1 sm:mr-2">
          <div className="w-9 h-9 rounded-xl bg-[#1A73E8]/15 border border-[#1A73E8]/35 text-[#8AB4F8] flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="hidden xs:inline font-semibold text-base tracking-tight text-[#E3E2E3]">Lịch</span>
        </div>

        {/* Navigation: Hôm nay + Chevrons + Month/Year Selectors */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={selectToday}
            className="px-3 py-1 text-xs font-semibold text-[#E3E2E3] border border-[#333538] hover:bg-[#28292A] rounded-md transition-colors cursor-pointer"
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

          {/* Quick Month & Year Selectors (Clean & Integrated) */}
          <div className="flex items-center gap-0.5 ml-1">
            <select
              value={selectedMonth}
              onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
              className="bg-transparent hover:bg-[#28292A] text-sm sm:text-base font-medium text-[#E3E2E3] py-0.5 px-1.5 rounded border border-transparent hover:border-[#333538] cursor-pointer focus:outline-none focus:border-[#8AB4F8] transition-colors"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx} className="bg-[#1F2021] text-[#E3E2E3]">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => selectDate(selectedDay, selectedMonth, Number(e.target.value))}
              className="bg-transparent hover:bg-[#28292A] text-sm sm:text-base font-medium text-[#E3E2E3] py-0.5 px-1 rounded border border-transparent hover:border-[#333538] cursor-pointer focus:outline-none focus:border-[#8AB4F8] font-mono transition-colors"
            >
              {yearsList.map((y) => (
                <option key={y} value={y} className="bg-[#1F2021] text-[#E3E2E3]">
                  {y}
                </option>
              ))}
            </select>
          </div>
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

      {/* 3. Right: View switcher, Settings, Profile */}
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
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
              calendarView === 'week'
                ? 'bg-[#28292A] text-[#8AB4F8] shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            {language === 'vi' ? 'Tuần' : 'Week'}
          </button>
        </div>

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
