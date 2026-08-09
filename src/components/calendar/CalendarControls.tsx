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
      <div className="flex items-center gap-3">
        <button
          onClick={selectToday}
          className="apple-glass-pill font-bold px-3.5 py-1.5 rounded-2xl text-xs hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 hover:border-blue-500/30 transition-all shadow-xs cursor-pointer text-slate-800 dark:text-slate-200"
        >
          {t('calendar.todayBtn')}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 rounded-2xl transition-all cursor-pointer"
            title={t('calendar.prevMonth')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 rounded-2xl transition-all cursor-pointer"
            title={t('calendar.nextMonth')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Month & Year Dropdown Capsule Selectors */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedMonth}
            onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
            className="apple-glass-pill font-bold text-sm sm:text-base app-text-primary px-2.5 py-1 rounded-xl cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            className="apple-glass-pill font-bold text-sm sm:text-base app-text-primary px-2.5 py-1 rounded-xl cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
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
      <div className="flex items-center apple-glass-pill p-1 rounded-2xl text-xs font-semibold border border-slate-300/80 dark:border-slate-700 shadow-xs">
        <button
          onClick={() => setCalendarView('month')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            calendarView === 'month'
              ? 'font-extrabold bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-black/10 dark:border-white/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 font-bold'
          }`}
        >
          {t('calendar.viewMonth')}
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
            calendarView === 'week'
              ? 'font-extrabold bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-black/10 dark:border-white/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 font-bold'
          }`}
        >
          <span>{t('calendar.viewWeek')}</span>
          <span className="text-[9px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold px-1.5 rounded-full">
            VIP
          </span>
        </button>
        <button
          onClick={() => setCalendarView('agenda')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            calendarView === 'agenda'
              ? 'font-extrabold bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm border border-black/10 dark:border-white/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/10 font-bold'
          }`}
        >
          {t('calendar.viewAgenda')}
        </button>
      </div>
    </div>
  );
};
