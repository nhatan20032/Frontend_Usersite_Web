import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const MonthGridView: React.FC = () => {
  const { eventsData, selectedDay, selectedMonth, selectedYear, selectDate, openDayInspector } = useApp();
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

  return (
    <div className="w-full select-none">
      {/* Google Calendar Dark Main Grid Container */}
      <div className="bg-[#121314] border border-[#2A2B2D] rounded-xl overflow-hidden shadow-md">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-[#2A2B2D] text-center text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider bg-[#121314]">
          {weekdayHeaders.map((name, i) => (
            <div key={i} className="py-2.5 px-1 truncate border-r border-[#2A2B2D] last:border-r-0">
              {name}
            </div>
          ))}
        </div>

        {/* Dynamic Month Grid */}
        <div className="grid grid-cols-7 divide-y divide-[#2A2B2D]">
          {/* Combine all cell slices into 7-col rows */}
          {/* Leading padding days from previous month */}
          {leadingPadding.map((pad) => (
            <div
              key={`grid-pad-prev-${pad}`}
              onClick={() => {
                selectDate(pad, prevMonthIndex, prevYear);
                openDayInspector(pad);
              }}
              title={language === 'vi' ? 'Nhấp để xem chi tiết & quản lý lịch trình' : 'Click to inspect & manage day'}
              className="p-1.5 min-h-[96px] sm:min-h-[112px] border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start"
            >
              <span className="text-[11px] font-normal text-[#4A4D51] px-1">{pad}</span>
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
                onClick={() => {
                  selectDate(d, selectedMonth, selectedYear);
                  openDayInspector(d);
                }}
                title={language === 'vi' ? 'Nhấp để xem chi tiết & quản lý lịch trình' : 'Click to inspect & manage day'}
                className={`p-1.5 min-h-[96px] sm:min-h-[112px] border-r border-[#2A2B2D] last:border-r-0 transition-colors cursor-pointer flex flex-col justify-between ${
                  isToday ? 'bg-[#1A73E8]/5' : 'hover:bg-[#1C1D1F]'
                }`}
              >
                {/* Day Header: Date Number with Google Blue Circle if Today */}
                <div className="flex items-center justify-start mb-1">
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

                {/* Event Chips List */}
                <div className="space-y-1 flex-1 flex flex-col justify-start overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const isGreen = ev.type === 'event' || ev.title.includes('Họp') || ev.title.includes('Khám');
                    return (
                      <div
                        key={ev.id}
                        className={`text-[10px] truncate px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-opacity hover:opacity-90 ${
                          isGreen
                            ? 'bg-[#1E8E3E] text-[#E6F4EA]'
                            : 'bg-[#174EA6] text-[#D2E3FC]'
                        }`}
                        title={`${ev.time ? ev.time + ' ' : ''}${ev.title}`}
                      >
                        {ev.time && <span className="font-semibold text-[9px] opacity-90">{ev.time.split(' ')[0]}</span>}
                        <span className="truncate">{ev.title}</span>
                      </div>
                    );
                  })}

                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-[#9AA0A6] hover:text-[#8AB4F8] font-medium px-1 pt-0.5">
                      +{dayEvents.length - 2} {language === 'vi' ? 'khác' : 'more'}
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
              onClick={() => {
                selectDate(pad, nextMonthIndex, nextYear);
                openDayInspector(pad);
              }}
              title={language === 'vi' ? 'Nhấp để xem chi tiết & quản lý lịch trình' : 'Click to inspect & manage day'}
              className="p-1.5 min-h-[96px] sm:min-h-[112px] border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start"
            >
              <span className="text-[11px] font-normal text-[#4A4D51] px-1">{pad}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
