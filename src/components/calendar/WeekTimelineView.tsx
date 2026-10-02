import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

const hours = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const parseEventHour = (evTime: string, targetHourStr: string): boolean => {
  if (!evTime) return false;
  const targetHour = parseInt(targetHourStr.split(':')[0], 10);
  const match = evTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) {
    return evTime.includes(targetHourStr.substring(0, 2));
  }
  let h = parseInt(match[1], 10);
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h === targetHour;
};

export const WeekTimelineView: React.FC = () => {
  const { eventsData, selectedDay, selectedMonth, selectedYear, openModal, selectDate } = useApp();
  const { t } = useLanguage();

  const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeek = selectedDate.getDay(); // 0 is Sunday
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

  const shortNames = [
    t('calendar.sunShort'),
    t('calendar.monShort'),
    t('calendar.tueShort'),
    t('calendar.wedShort'),
    t('calendar.thuShort'),
    t('calendar.friShort'),
    t('calendar.satShort'),
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d,
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      dayName: shortNames[d.getDay()],
    };
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#121314] select-none overflow-hidden">
      {/* 1. Sticky Week Day Column Headers */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-[#2A2B2D] bg-[#121314] shrink-0 z-20">
        <div className="py-2.5 px-2 text-center text-[10px] font-mono font-medium text-[#70757A] border-r border-[#2A2B2D] flex items-center justify-center">
          GMT+7
        </div>
        {weekDays.map((wd) => {
          const isSelected =
            wd.day === selectedDay && wd.month === selectedMonth && wd.year === selectedYear;
          const isToday =
            wd.day === new Date().getDate() &&
            wd.month === new Date().getMonth() &&
            wd.year === new Date().getFullYear();

          return (
            <div
              key={`hdr-${wd.day}-${wd.month}`}
              onClick={() => selectDate(wd.day, wd.month, wd.year)}
              className={`py-2 px-1 text-center cursor-pointer transition-colors border-r border-[#2A2B2D] last:border-r-0 ${
                isSelected ? 'bg-[#1A73E8]/10' : 'hover:bg-[#1C1D1F]'
              }`}
            >
              <span className="text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider block">
                {wd.dayName}
              </span>
              <div className="mt-0.5 flex items-center justify-center">
                {isToday ? (
                  <span className="w-6 h-6 rounded-full bg-[#1A73E8] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {wd.day}
                  </span>
                ) : (
                  <span className={`text-xs font-semibold ${isSelected ? 'text-[#8AB4F8]' : 'text-[#E3E2E3]'}`}>
                    {wd.day}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Scrollable Timeline Grid */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2A2B2D]/60 custom-scrollbar">
        {hours.map((h) => (
          <div key={h} className="grid grid-cols-[64px_repeat(7,1fr)] min-h-[52px] group">
            {/* Time Label Column */}
            <div className="py-1 px-1.5 text-center text-[11px] font-mono text-[#70757A] border-r border-[#2A2B2D] flex items-start justify-center pt-2 select-none">
              {h}
            </div>

            {/* 7 Day Columns */}
            {weekDays.map((wd) => {
              const dayHourEvents = eventsData.filter(
                (e) =>
                  e.year === wd.year &&
                  e.month === wd.month &&
                  e.day === wd.day &&
                  parseEventHour(e.time, h)
              );

              return (
                <div
                  key={`${h}-${wd.day}-${wd.month}`}
                  onClick={() => {
                    selectDate(wd.day, wd.month, wd.year);
                    if (dayHourEvents.length === 0) {
                      openModal('create');
                    }
                  }}
                  className="p-1 border-r border-[#2A2B2D] last:border-r-0 transition-colors hover:bg-[#161719] flex flex-col gap-1 cursor-pointer overflow-hidden min-h-[52px]"
                >
                  {dayHourEvents.map((ev) => {
                    const isRoutine = ev.type === 'routine';
                    const chipBg = isRoutine
                      ? 'bg-[#D96B27] hover:bg-[#C25E20]'
                      : 'bg-[#1A73E8] hover:bg-[#1B66CA]';

                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('detail', ev.id);
                        }}
                        className={`px-1.5 py-1 rounded text-[10px] text-white font-medium truncate shadow-xs transition-colors cursor-pointer ${chipBg}`}
                        title={`${ev.time ? ev.time + ' - ' : ''}${ev.title}`}
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                          <span className="font-semibold text-[9px] text-white/85 shrink-0 font-mono">
                            {ev.time ? ev.time.split(' ')[0] : ''}
                          </span>
                          <span className="truncate">{ev.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
