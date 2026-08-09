import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
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

  return (
    <div id="calendarHeader" className="h-16 px-4 sm:px-6 border-b app-border flex items-center justify-between gap-4 flex-shrink-0 apple-glass-surface">
      <div className="flex items-center gap-3">
        <button
          onClick={selectToday}
          className="apple-glass-pill font-bold px-3.5 py-1.5 rounded-2xl text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-xs cursor-pointer"
        >
          Hôm nay
        </button>

        <div className="flex items-center gap-1 app-text-secondary">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl cursor-pointer"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl cursor-pointer"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Month & Year Dropdown Capsule Selectors */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedMonth}
            onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
            className="apple-glass-pill font-bold text-sm sm:text-base app-text-primary px-2.5 py-1 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            className="apple-glass-pill font-bold text-sm sm:text-base app-text-primary px-2.5 py-1 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {yearsList.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                {`năm ${y}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apple Segmented Control (View Mode Switcher) */}
      <div className="flex items-center apple-glass-pill p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setCalendarView('month')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            calendarView === 'month'
              ? 'font-bold bg-white/90 dark:bg-white/20 text-blue-600 dark:text-sky-400 shadow-xs'
              : 'app-text-secondary hover:text-blue-600'
          }`}
        >
          Lưới tháng
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`px-3.5 py-1.5 transition-all flex items-center gap-1 cursor-pointer ${
            calendarView === 'week'
              ? 'font-bold bg-white/90 dark:bg-white/20 text-blue-600 dark:text-sky-400 shadow-xs'
              : 'app-text-secondary hover:text-blue-600'
          }`}
        >
          <span>Tuần</span>
          <span className="text-[9px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold px-1.5 rounded-full">
            VIP
          </span>
        </button>
        <button
          onClick={() => setCalendarView('agenda')}
          className={`px-3.5 py-1.5 transition-all cursor-pointer ${
            calendarView === 'agenda'
              ? 'font-bold bg-white/90 dark:bg-white/20 text-blue-600 dark:text-sky-400 shadow-xs'
              : 'app-text-secondary hover:text-blue-600'
          }`}
        >
          Lịch trình
        </button>
      </div>
    </div>
  );
};
