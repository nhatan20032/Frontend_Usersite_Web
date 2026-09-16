import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

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
  const { language, t } = useLanguage();

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

  const startDateStr = `${weekDays[0].day.toString().padStart(2, '0')}/${(weekDays[0].month + 1).toString().padStart(2, '0')}`;
  const endDateStr = `${weekDays[6].day.toString().padStart(2, '0')}/${(weekDays[6].month + 1).toString().padStart(2, '0')}/${weekDays[6].year}`;

  return (
    <div className="w-full h-full p-3 sm:p-4 overflow-y-auto bg-[#121314] select-none">
      <div className="bg-[#1F2021] border border-[#2A2B2D] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3 text-xs">
          <span className="font-semibold text-[#E3E2E3]">
            {language === 'vi'
              ? `Khung giờ lịch trình tuần (${startDateStr} - ${endDateStr})`
              : `Weekly Schedule Timeline (${startDateStr} - ${endDateStr})`}
          </span>
          <span className="text-[#8AB4F8] font-medium text-xs">
            {language === 'vi' ? 'Lịch làm việc chuẩn' : 'Standard Schedule'}
          </span>
        </div>

        {/* Week Day Column Headers */}
        <div className="grid grid-cols-8 gap-2 pb-2 border-b border-[#2A2B2D] text-center text-xs font-semibold">
          <span className="text-[11px] text-[#70757A]">{language === 'vi' ? 'Giờ' : 'Time'}</span>
          {weekDays.map((wd) => {
            const isSelected =
              wd.day === selectedDay && wd.month === selectedMonth && wd.year === selectedYear;
            return (
              <div
                key={`hdr-${wd.day}-${wd.month}`}
                onClick={() => selectDate(wd.day, wd.month, wd.year)}
                className={`py-1.5 px-1 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1A73E8]/20 text-[#8AB4F8] font-bold border border-[#1A73E8]/40'
                    : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A]'
                }`}
              >
                <div>{wd.dayName}</div>
                <div className="text-[11px] font-mono mt-0.5">{wd.day}</div>
              </div>
            );
          })}
        </div>

        <div className="space-y-1.5 overflow-x-auto min-w-[580px]">
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-8 gap-2 border-b border-[#2A2B2D]/50 py-1.5 text-xs items-center">
              <div className="text-[11px] text-[#70757A] font-medium font-mono">{h}</div>
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
                        className={`p-1.5 rounded-md text-[10px] font-medium truncate cursor-pointer shadow-xs transition-opacity hover:opacity-90 ${
                          ev.type === 'routine'
                            ? 'bg-[#E37400]/20 text-[#FDD663] border border-[#E37400]/40'
                            : 'bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/40'
                        }`}
                      >
                        {ev.title}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`${h}-${wd.day}-${wd.month}`}
                      onClick={() => {
                        selectDate(wd.day, wd.month, wd.year);
                        openModal('create');
                      }}
                      title={language === 'vi' ? `Nhấp để tạo sự kiện lúc ${h}` : `Click to create event at ${h}`}
                      className="h-8 border border-dashed border-[#2A2B2D] rounded-md cursor-pointer hover:bg-[#28292A] transition-colors"
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
