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
    <div className="space-y-2 border-b border-[#2A2B2D] pb-3 flex-shrink-0 select-none">
      {/* Month & Year Header with Chevrons */}
      <div className="flex items-center justify-between font-medium text-xs text-[#E3E2E3] px-1">
        <span className="font-semibold text-xs text-[#E3E2E3]">
          {language === 'vi' ? `${monthNames[selectedMonth]} năm ${selectedYear}` : `${monthNames[selectedMonth]} ${selectedYear}`}
        </span>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-[#28292A] text-[#9AA0A6] hover:text-[#E3E2E3] rounded-full transition-colors cursor-pointer flex-shrink-0"
            title={t('calendar.prevMonth')}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-[#28292A] text-[#9AA0A6] hover:text-[#E3E2E3] rounded-full transition-colors cursor-pointer flex-shrink-0"
            title={t('calendar.nextMonth')}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-[#70757A]">
        {miniWeekDays.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-normal">
        {/* Leading padding for previous month */}
        {leadingPadding.map((pad) => (
          <button
            key={`mini-pad-prev-${pad}`}
            onClick={() => selectDate(pad, prevMonthIndex, prevYear)}
            className="w-6 h-6 mx-auto flex items-center justify-center rounded-full text-[#4A4D51] hover:bg-[#1F2021] cursor-pointer text-[11px]"
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
              className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors text-[11px] ${
                isSelected
                  ? 'bg-[#1A73E8] text-white font-bold'
                  : 'hover:bg-[#28292A] text-[#E3E2E3]'
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
            className="w-6 h-6 mx-auto flex items-center justify-center rounded-full text-[#4A4D51] hover:bg-[#1F2021] cursor-pointer text-[11px]"
          >
            {pad}
          </button>
        ))}
      </div>
    </div>
  );
};
