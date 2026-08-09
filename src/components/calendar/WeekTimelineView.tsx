import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check } from 'lucide-react';

const hours = [
  '06:00 AM',
  '08:00 AM',
  '10:00 AM',
  '12:00 PM',
  '14:00 PM',
  '16:00 PM',
  '18:00 PM',
  '20:00 PM',
];

export const WeekTimelineView: React.FC = () => {
  const { eventsData, selectedDay, selectedMonth, selectedYear, openModal, selectDate } = useApp();

  const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeek = selectedDate.getDay(); // 0 is Sunday
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d,
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      dayName: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
    };
  });

  const startDateStr = `${weekDays[0].day.toString().padStart(2, '0')}/${(weekDays[0].month + 1).toString().padStart(2, '0')}`;
  const endDateStr = `${weekDays[6].day.toString().padStart(2, '0')}/${(weekDays[6].month + 1).toString().padStart(2, '0')}/${weekDays[6].year}`;

  return (
    <div className="space-y-4">
      <div className="apple-glass-card rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b app-border pb-3 text-xs">
          <span className="font-bold app-text-primary">
            {`Khung giờ lịch trình tuần (${startDateStr} - ${endDateStr})`}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Mở khóa bởi Premium
          </span>
        </div>

        {/* Week Day Column Headers */}
        <div className="grid grid-cols-8 gap-2 pb-2 border-b app-border text-center text-xs font-bold">
          <span className="text-[11px] app-text-muted">Giờ</span>
          {weekDays.map((wd) => {
            const isSelected =
              wd.day === selectedDay && wd.month === selectedMonth && wd.year === selectedYear;
            return (
              <div
                key={`hdr-${wd.day}-${wd.month}`}
                onClick={() => selectDate(wd.day, wd.month, wd.year)}
                className={`p-1 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-500/15 text-blue-600 font-bold'
                    : 'app-text-secondary hover:text-blue-600'
                }`}
              >
                <div>{wd.dayName}</div>
                <div className="text-[11px]">{wd.day}</div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 overflow-x-auto min-w-[580px]">
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-8 gap-2 border-b app-border py-2 text-xs items-center">
              <div className="text-[11px] app-text-muted font-medium">{h}</div>
              <div className="col-span-7 grid grid-cols-7 gap-1.5">
                {weekDays.map((wd) => {
                  const ev = eventsData.find(
                    (e) =>
                      e.year === wd.year &&
                      e.month === wd.month &&
                      e.day === wd.day &&
                      e.time.includes(h.substring(0, 2))
                  );
                  if (ev) {
                    return (
                      <div
                        key={`${h}-${wd.day}-${wd.month}`}
                        onClick={() => openModal('detail', ev.id)}
                        className={`p-1.5 rounded-xl text-[10px] font-bold truncate cursor-pointer shadow-xs ${
                          ev.type === 'routine'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40'
                            : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40'
                        }`}
                      >
                        {ev.title}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`${h}-${wd.day}-${wd.month}`}
                      onClick={() => selectDate(wd.day, wd.month, wd.year)}
                      className="h-8 border border-dashed app-border rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
