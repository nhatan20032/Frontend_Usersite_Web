import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export const CalendarControls: React.FC = () => {
  const {
    selectedDay,
    selectedMonth,
    selectedYear,
    calendarView,
    setCalendarView,
    selectDate,
    selectToday,
    prevMonth,
    nextMonth,
  } = useApp();
  const { language, t } = useLanguage();

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  return (
    <div id="calendarHeader" className="h-16 px-4 sm:px-6 border-b app-border flex items-center justify-between gap-4 flex-shrink-0 apple-glass-surface">
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* Apple Segmented Control (Date Navigation Capsule) */}
        <div className="flex items-center apple-glass-pill p-1 rounded-2xl text-xs font-semibold border border-slate-300/80 dark:border-slate-700 shadow-xs flex-shrink-0">
          <button
            onClick={selectToday}
            className="h-8 min-w-[72px] sm:min-w-[80px] px-3 rounded-xl font-extrabold text-blue-600 dark:text-sky-400 hover:bg-blue-500/15 hover:text-blue-700 dark:hover:text-sky-300 active:bg-blue-500/25 transition-all cursor-pointer flex items-center justify-center"
          >
            {t('calendar.todayBtn')}
          </button>
          <div className="w-[1px] h-4 bg-slate-300/80 dark:bg-slate-700 mx-0.5 flex-shrink-0" />
          <button
            onClick={prevMonth}
            className="h-8 w-8 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 active:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            title={t('calendar.prevMonth')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="h-8 w-8 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 active:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            title={t('calendar.nextMonth')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Month & Year Dropdown Capsule Selectors */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <select
            value={selectedMonth}
            onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
            className="apple-glass-pill h-10 font-bold text-xs sm:text-sm app-text-primary w-[112px] sm:w-[124px] px-2.5 rounded-2xl border border-slate-300/80 dark:border-slate-700 shadow-xs cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center flex-shrink-0"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => selectDate(selectedDay, selectedMonth, Number(e.target.value))}
            className="apple-glass-pill h-10 font-bold text-xs sm:text-sm app-text-primary w-[80px] sm:w-[88px] px-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 shadow-xs cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-center flex-shrink-0"
          >
            {yearsList.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                {language === 'vi' ? `năm ${y}` : `${y}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apple Segmented Control (View Mode Switcher) */}
      <div className="flex items-center apple-glass-pill p-1 rounded-2xl text-xs font-semibold border border-slate-300/80 dark:border-slate-700 shadow-xs flex-shrink-0">
        <button
          onClick={() => setCalendarView('month')}
          className={`h-8 min-w-[68px] sm:min-w-[80px] text-center px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            calendarView === 'month'
              ? 'font-extrabold bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-black/10 dark:border-white/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 font-bold'
          }`}
        >
          {t('calendar.viewMonth')}
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`h-8 min-w-[76px] sm:min-w-[88px] text-center px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            calendarView === 'week'
              ? 'font-extrabold bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-black/10 dark:border-white/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 font-bold'
          }`}
        >
          <span>{t('calendar.viewWeek')}</span>
          <span className="text-[9px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold px-1 rounded-full flex-shrink-0">
            VIP
          </span>
        </button>
      </div>
    </div>
  );
};
