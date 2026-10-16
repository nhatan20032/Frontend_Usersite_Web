import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Settings,
  Bell,
} from 'lucide-react';

interface CustomSelectProps {
  value: number;
  options: { label: string | number; value: number }[];
  onChange: (value: number) => void;
  className?: string;
  isMono?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, className = '', isMono }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 bg-transparent hover:bg-[#28292A] text-sm sm:text-base font-medium text-[#E3E2E3] py-0.5 px-1.5 rounded border border-transparent hover:border-[#333538] focus:outline-none focus:border-[#8AB4F8] transition-colors ${isOpen ? 'bg-[#28292A] border-[#333538]' : ''} ${isMono ? 'font-mono px-1' : ''}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#9AA0A6]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 max-h-64 overflow-y-auto w-full bg-[#28292A] border border-[#333538] rounded-md shadow-lg z-50 py-1 custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${value === opt.value ? 'bg-[#1A73E8] text-white' : 'text-[#E3E2E3] hover:bg-[#3C4043]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Sắp diễn ra cuộc hẹn',
      desc: 'Hội thảo Công Nghệ & AI Summit trong 25 phút nữa (TT Hội nghị Quốc gia)',
      time: '10 phút trước',
      read: false,
    },
    {
      id: 2,
      type: 'streak',
      title: 'Chúc mừng Streak 14 ngày! 🔥',
      desc: 'Bạn đã hoàn thành thói quen chạy bộ liên tục trong 2 tuần.',
      time: '1 giờ trước',
      read: false,
    },
    {
      id: 3,
      type: 'billing',
      title: 'Nâng cấp RoutinePulse VIP',
      desc: 'Tài khoản của bạn đã được kích hoạt đặc quyền VIP trọn năm.',
      time: 'Hôm qua',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  return (
    <header
      id="topHeader"
      className="h-14 border-b border-[var(--border-grid)] bg-[var(--surface-canvas)] px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0 z-30 relative select-none transition-colors duration-200"
    >
      {/* 1. Left: Hamburger + Logo & Navigation Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">


        {/* Calendar Brand Logo */}
        <div className="flex items-center gap-2.5 mr-1 sm:mr-2">
          <div className="w-9 h-9 rounded-lg bg-[#1A73E8] text-white flex flex-col items-center justify-center shadow-sm select-none shrink-0">
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/85 leading-none">
              {language === 'vi' ? `T${selectedMonth + 1}` : 'CAL'}
            </span>
            <span className="text-sm font-bold text-white leading-tight">
              {new Date().getDate()}
            </span>
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
            <CustomSelect
              value={selectedMonth}
              onChange={(val) => selectDate(selectedDay, val, selectedYear)}
              options={monthNames.map((name, idx) => ({ label: name, value: idx }))}
            />

            <CustomSelect
              value={selectedYear}
              onChange={(val) => selectDate(selectedDay, selectedMonth, val)}
              options={yearsList.map((y) => ({ label: y, value: y }))}
              isMono
            />
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
          <button
            onClick={() => setCalendarView('agenda')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
              calendarView === 'agenda'
                ? 'bg-[#28292A] text-[#8AB4F8] shadow-xs'
                : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
            }`}
          >
            {language === 'vi' ? 'Lịch biểu' : 'Schedule'}
          </button>
        </div>

        {/* Notification Center Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="p-2 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer relative"
            title="Trung tâm thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EA4335] ring-2 ring-[#1F2021]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1F2021] border border-[#333538] rounded-xl shadow-2xl p-3 space-y-3 z-50 text-[#E3E2E3] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[#E3E2E3]">Thông báo hệ thống</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#1A73E8] text-white px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      onClick={markAllAsRead}
                      className="text-[#8AB4F8] hover:underline cursor-pointer"
                    >
                      Đã đọc hết
                    </button>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[#70757A] hover:text-[#F28B82] cursor-pointer"
                      title="Xóa tất cả"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#70757A]">
                    Bạn không có thông báo mới nào
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                        );
                      }}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer space-y-1 ${
                        n.read
                          ? 'bg-[#18191A] border-[#2A2B2D] opacity-75'
                          : 'bg-[#242527] border-[#3A3B3D] hover:border-[#8AB4F8]/50 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="font-semibold text-xs text-[#E3E2E3] flex items-center gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#8AB4F8]" />}
                          <span>{n.title}</span>
                        </span>
                        <span className="text-[9px] text-[#70757A] font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#9AA0A6] leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
