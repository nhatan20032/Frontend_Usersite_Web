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
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
];

const yearsList = Array.from({ length: 16 }, (_, i) => 2020 + i);

export const MiniCalendarPicker: React.FC = () => {
  const { selectedDay, selectedMonth, selectedYear, selectDate, prevMonth, nextMonth } = useApp();
  const { language, t } = useLanguage();

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();
  const prevMonthDaysCount = new Date(selectedYear, selectedMonth, 0).getDate();

  const leadingPadding = Array.from(
    { length: firstDayIndex },
    (_, i) => prevMonthDaysCount - firstDayIndex + 1 + i
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = leadingPadding.length + currentMonthDays.length;
  const trailingPaddingCount = (7 - (totalCells % 7)) % 7;
  const trailingPadding = Array.from({ length: trailingPaddingCount }, (_, i) => i + 1);

  const prevMonthIndex = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const nextMonthIndex = selectedMonth === 11 ? 0 : selectedMonth + 1;
  const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;

  const miniWeekDays = [
    t('calendar.sunShort'),
    t('calendar.monShort'),
    t('calendar.tueShort'),
    t('calendar.wedShort'),
    t('calendar.thuShort'),
    t('calendar.friShort'),
    t('calendar.satShort'),
  ];

  return (
    <div className="space-y-2.5 border-b app-border pb-4 flex-shrink-0">
      <div className="flex items-center justify-between font-bold text-xs app-text-primary">
        <div className="flex items-center gap-1">
          <select
            value={selectedMonth}
            onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
            className="apple-glass-pill text-xs font-bold app-text-primary px-1.5 py-0.5 rounded-lg cursor-pointer hover:bg-blue-500/10 focus:outline-none"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => selectDate(selectedDay, selectedMonth, Number(e.target.value))}
            className="apple-glass-pill text-xs font-bold app-text-primary px-1.5 py-0.5 rounded-lg cursor-pointer hover:bg-blue-500/10 focus:outline-none font-mono"
          >
            {yearsList.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 rounded-xl transition-all cursor-pointer"
            title={t('calendar.prevMonth')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 rounded-xl transition-all cursor-pointer"
            title={t('calendar.nextMonth')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold app-text-muted">
        {miniWeekDays.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
        {/* Leading padding for previous month */}
        {leadingPadding.map((pad) => (
          <button
            key={`mini-pad-prev-${pad}`}
            onClick={() => selectDate(pad, prevMonthIndex, prevYear)}
            className="p-1 opacity-40 text-slate-400 dark:text-slate-600 hover:opacity-75 cursor-pointer"
          >
            {pad}
          </button>
        ))}

        {/* Current month days */}
        {currentMonthDays.map((d) => {
          const isSelected = d === selectedDay;
          return (
            <button
              key={d}
              onClick={() => selectDate(d, selectedMonth, selectedYear)}
              className={`p-1 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 app-text-primary'
              }`}
            >
              {d}
            </button>
          );
        })}

        {/* Trailing padding for next month */}
        {trailingPadding.map((pad) => (
          <button
            key={`mini-pad-next-${pad}`}
            onClick={() => selectDate(pad, nextMonthIndex, nextYear)}
            className="p-1 opacity-40 text-slate-400 dark:text-slate-600 hover:opacity-75 cursor-pointer"
          >
            {pad}
          </button>
        ))}
      </div>
    </div>
  );
};
