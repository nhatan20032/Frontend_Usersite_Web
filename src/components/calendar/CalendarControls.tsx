import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
    selectDate,
  } = useApp();
  const { language } = useLanguage();

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  return (
    <div
      id="calendarHeader"
      className="h-12 px-4 sm:px-6 border-b border-[#2A2B2D] bg-[#121314] flex items-center justify-between gap-4 flex-shrink-0 select-none text-xs"
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="text-[#9AA0A6] font-medium hidden sm:inline">Chuyển nhanh:</span>
        {/* Quick Month & Year Dropdown Capsule Selectors */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <select
            value={selectedMonth}
            onChange={(e) => selectDate(selectedDay, Number(e.target.value), selectedYear)}
            className="h-8 font-medium text-xs bg-[#1F2021] text-[#E3E2E3] px-2.5 rounded-md border border-[#333538] hover:border-[#8AB4F8] transition-colors cursor-pointer focus:outline-none focus:border-[#8AB4F8]"
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
            className="h-8 font-medium text-xs bg-[#1F2021] text-[#E3E2E3] px-2 rounded-md border border-[#333538] hover:border-[#8AB4F8] transition-colors cursor-pointer focus:outline-none focus:border-[#8AB4F8] font-mono"
          >
            {yearsList.map((y) => (
              <option key={y} value={y} className="bg-[#1F2021] text-[#E3E2E3]">
                {language === 'vi' ? `năm ${y}` : `${y}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Navigation & Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-[#70757A] text-[11px] font-mono">
          {language === 'vi' ? `Tháng ${selectedMonth + 1}/${selectedYear}` : `${monthNames[selectedMonth]} ${selectedYear}`}
        </span>
      </div>
    </div>
  );
};
