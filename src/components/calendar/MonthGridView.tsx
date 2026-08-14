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
    <div className="space-y-4">
      <div className="apple-glass-card rounded-3xl p-5 space-y-3">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold app-text-secondary border-b app-border pb-2.5">
          {weekdayHeaders.map((name, i) => (
            <span key={i} className="truncate px-0.5" title={name}>{name}</span>
          ))}
        </div>

        {/* Dynamic Month Grid */}
        <div className="grid grid-cols-7 gap-2 min-h-[420px]">
          {/* Leading padding days from previous month */}
          {leadingPadding.map((pad) => (
            <div
              key={`grid-pad-prev-${pad}`}
              onClick={() => {
                selectDate(pad, prevMonthIndex, prevYear);
                openDayInspector(pad);
              }}
              title={language === 'vi' ? 'Nhấp để xem chi tiết & quản lý lịch trình' : 'Click to inspect & manage day'}
              className="p-2.5 rounded-2xl apple-glass-pill opacity-40 text-slate-400 dark:text-slate-600 text-xs min-h-[85px] cursor-pointer hover:opacity-75 transition-opacity select-none"
            >
              {pad}
            </div>
          ))}

          {/* Current month dynamic days */}
          {currentMonthDays.map((d) => {
            const dayEvents = eventsData.filter(
              (e) => e.year === selectedYear && e.month === selectedMonth && e.day === d
            );
            const isSelected = d === selectedDay;

            return (
              <div
                key={d}
                onClick={() => {
                  selectDate(d, selectedMonth, selectedYear);
                  openDayInspector(d);
                }}
                title={language === 'vi' ? 'Nhấp để xem chi tiết & quản lý lịch trình' : 'Click to inspect & manage day'}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer min-h-[85px] flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-2 border-blue-500 bg-blue-500/10 shadow-sm ring-2 ring-blue-500/20'
                    : 'border app-border apple-glass-card hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xs'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs font-bold ${
                    isSelected ? 'text-blue-600 dark:text-sky-400' : 'app-text-primary'
                  }`}
                >
                  <span>{d}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400" />
                  )}
                </div>

                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] truncate px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                        ev.type === 'routine'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.type === 'routine' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span>{ev.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-slate-400 dark:text-slate-400 font-bold px-1">
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
              className="p-2.5 rounded-2xl apple-glass-pill opacity-40 text-slate-400 dark:text-slate-600 text-xs min-h-[85px] cursor-pointer hover:opacity-75 transition-opacity select-none"
            >
              {pad}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
