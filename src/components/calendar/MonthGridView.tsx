import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

const monthNamesShortEn = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MonthGridView: React.FC = () => {
  const { eventsData, selectedDay, selectedMonth, selectedYear, selectDate, openModal, closeDayInspector } = useApp();
  const { language, t } = useLanguage();

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sunday
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

  const weekdayHeaders = [
    t('calendar.sun'),
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
  ];

  const handleCellClick = (day: number, month: number, year: number) => {
    selectDate(day, month, year);
    closeDayInspector();
    openModal('create');
  };

  return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden bg-[#121314]">
      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 border-b border-[#2A2B2D] text-center text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider bg-[#121314] shrink-0">
        {weekdayHeaders.map((name, i) => (
          <div key={i} className="py-2 px-1 truncate border-r border-[#2A2B2D] last:border-r-0">
            {name}
          </div>
        ))}
      </div>

      {/* Dynamic Month Grid (Full Height Liquid Layout) */}
      <div
        className="grid grid-cols-7 flex-1 w-full h-full divide-x divide-y divide-[#2A2B2D] overflow-hidden"
        style={{ gridAutoRows: '1fr' }}
      >
        {/* Leading padding days from previous month */}
        {leadingPadding.map((pad) => (
          <div
            key={`grid-pad-prev-${pad}`}
            onClick={() => handleCellClick(pad, prevMonthIndex, prevYear)}
            title={language === 'vi' ? 'Nhấp để tạo lịch trình mới' : 'Click to create new event'}
            className="p-1 sm:p-1.5 h-full border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start overflow-hidden"
          >
            <div className="flex items-center justify-end">
              <span className="text-[11px] font-normal text-[#4A4D51] px-1">{pad}</span>
            </div>
          </div>
        ))}

        {/* Current month dynamic days */}
        {currentMonthDays.map((d) => {
          const dayEvents = eventsData.filter(
            (e) => e.year === selectedYear && e.month === selectedMonth && e.day === d
          );
          const isToday = d === selectedDay;

          return (
            <div
              key={d}
              onClick={() => handleCellClick(d, selectedMonth, selectedYear)}
              title={language === 'vi' ? 'Nhấp để tạo lịch trình mới' : 'Click to create new event'}
              className={`p-1 sm:p-1.5 h-full border-r border-[#2A2B2D] last:border-r-0 transition-colors cursor-pointer flex flex-col justify-start overflow-hidden ${
                isToday ? 'bg-[#1A73E8]/5' : 'hover:bg-[#1C1D1F]'
              }`}
            >
              {/* Day Header: Date Number with Google Blue Circle if Today */}
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-medium text-[#8AB4F8] truncate">
                  {d === 1 ? (language === 'vi' ? `1 thg ${selectedMonth + 1}` : `1 ${monthNamesShortEn[selectedMonth]}`) : ''}
                </span>
                {isToday ? (
                  <span className="w-6 h-6 rounded-full bg-[#1A73E8] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {d}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#E3E2E3] px-1 hover:text-white">
                    {d}
                  </span>
                )}
              </div>

              {/* Event Chips List (Muted Pastel Surfaces) */}
              <div className="space-y-1 flex-1 flex flex-col justify-start overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => {
                  const isRoutine = ev.type === 'routine';
                  const isEvent = ev.type === 'event';
                  const chipStyle = isRoutine
                    ? 'bg-[#E37400]/15 border border-[#E37400]/35 text-[#FDD663] hover:bg-[#E37400]/25'
                    : isEvent
                    ? 'bg-[#1A73E8]/15 border border-[#1A73E8]/35 text-[#8AB4F8] hover:bg-[#1A73E8]/25'
                    : 'bg-[#1E8E3E]/15 border border-[#1E8E3E]/35 text-[#81C995] hover:bg-[#1E8E3E]/25';

                  const dotColor = isRoutine
                    ? 'bg-[#FDD663]'
                    : isEvent
                    ? 'bg-[#8AB4F8]'
                    : 'bg-[#81C995]';

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('detail', ev.id);
                      }}
                      className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium flex items-center gap-1.5 transition-all ${chipStyle}`}
                      title={`${ev.time ? ev.time + ' ' : ''}${ev.title}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                      {ev.time && <span className="font-semibold text-[9px] opacity-80 shrink-0 font-mono">{ev.time.split(' ')[0]}</span>}
                      <span className="truncate">{ev.title}</span>
                    </div>
                  );
                })}

                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-[#9AA0A6] hover:text-[#8AB4F8] font-medium px-1">
                    +{dayEvents.length - 3} {language === 'vi' ? 'khác' : 'more'}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing padding days from next month */}
        {trailingPadding.map((pad) => (
          <div
            key={`grid-pad-next-${pad}`}
            onClick={() => handleCellClick(pad, nextMonthIndex, nextYear)}
            title={language === 'vi' ? 'Nhấp để tạo lịch trình mới' : 'Click to create new event'}
            className="p-1 sm:p-1.5 h-full border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start overflow-hidden"
          >
            <div className="flex items-center justify-end">
              <span className="text-[11px] font-normal text-[#4A4D51] px-1">{pad}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
