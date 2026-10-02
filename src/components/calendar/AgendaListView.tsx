import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CalendarCheck2,
  Calendar as CalendarIcon,
  Flame,
  Check,
  MapPin,
  Clock,
} from 'lucide-react';

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

export const AgendaListView: React.FC = () => {
  const {
    eventsData,
    selectedDay,
    selectedMonth,
    selectedYear,
    categoryFilters,
    searchQuery,
    toggleCheckInRoutine,
    openModal,
  } = useApp();
  const { language, t } = useLanguage();

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  const filtered = eventsData.filter((e) => {
    if (e.year !== selectedYear || e.month !== selectedMonth || e.day !== selectedDay) return false;
    if (e.type === 'routine' && !categoryFilters.routine) return false;
    if (e.type === 'event' && !categoryFilters.event) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full h-full p-4 sm:p-6 overflow-y-auto bg-[#121314] select-none custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3">
          <h3 className="font-semibold text-base text-[#E3E2E3] flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-[#8AB4F8]" />
            <span>
              {language === 'vi'
                ? `Lịch trình ngày ${selectedDay} ${monthNames[selectedMonth]} năm ${selectedYear}`
                : `Schedule for ${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`}
            </span>
          </h3>
          <span className="text-xs text-[#9AA0A6] hidden sm:inline">
            {language === 'vi' ? 'Nhấp vào mục để xem chi tiết hoặc điểm danh' : 'Click an item for details or check-in'}
          </span>
        </div>

        {/* Event List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#1F2021] border border-[#2A2B2D] p-10 text-center rounded-xl space-y-2">
              <CalendarIcon className="w-8 h-8 text-[#70757A] mx-auto" />
              <p className="text-xs text-[#9AA0A6] font-medium">
                {t('calendar.emptyDayEvents')}
              </p>
              <button
                onClick={() => openModal('create')}
                className="text-[#8AB4F8] hover:text-[#AECBFA] font-semibold text-xs hover:underline cursor-pointer"
              >
                + {t('sidebar.addSchedule')}
              </button>
            </div>
          ) : (
            filtered.map((ev) => {
              const isRoutine = ev.type === 'routine';
              const isEvent = ev.type === 'event';

              let priorityBadge = null;
              if (ev.priority === 'high') {
                priorityBadge = (
                  <span className="bg-[#F28B82]/15 text-[#F28B82] border border-[#F28B82]/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {t('common.high')}
                  </span>
                );
              } else if (ev.priority === 'medium') {
                priorityBadge = (
                  <span className="bg-[#FDD663]/15 text-[#FDD663] border border-[#FDD663]/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {t('common.medium')}
                  </span>
                );
              } else {
                priorityBadge = (
                  <span className="bg-[#28292A] text-[#9AA0A6] border border-[#333538] text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {t('common.low')}
                  </span>
                );
              }

              if (isRoutine) {
                return (
                  <div
                    key={ev.id}
                    onClick={() => openModal('detail', ev.id)}
                    className="bg-[#1F2021] hover:bg-[#242527] border border-[#2A2B2D] hover:border-[#3A3B3D] p-4 rounded-xl flex items-start justify-between gap-4 cursor-pointer transition-all border-l-4 border-l-[#FDD663]"
                  >
                    <div className="space-y-1.5 text-xs flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-semibold text-[#E3E2E3]">
                        <span className="text-[#FDD663] font-mono shrink-0">{ev.time}</span>
                        <span className="text-sm truncate">{ev.title}</span>
                        <span className="bg-[#FDD663]/15 text-[#FDD663] border border-[#FDD663]/30 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 font-mono shrink-0">
                          <Flame className="w-3.5 h-3.5 text-[#FDD663] shrink-0" />
                          <span>{ev.streak} {t('common.days')}</span>
                        </span>
                        <span className="shrink-0">{priorityBadge}</span>
                      </div>
                      <p className="text-[#9AA0A6] text-[11px] line-clamp-1">
                        {ev.frequency || (language === 'vi' ? 'Rèn luyện thói quen kỷ luật mỗi ngày.' : 'Daily discipline routine building.')}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheckInRoutine(ev.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                        ev.completed
                          ? 'bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/40'
                          : 'bg-[#1A73E8] hover:bg-[#1B66CA] text-white shadow-xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{ev.completed ? (language === 'vi' ? 'Đã điểm danh' : 'Checked In') : (language === 'vi' ? 'Điểm danh' : 'Check In')}</span>
                    </button>
                  </div>
                );
              }

              if (isEvent) {
                return (
                  <div
                    key={ev.id}
                    onClick={() => openModal('detail', ev.id)}
                    className="bg-[#1F2021] hover:bg-[#242527] border border-[#2A2B2D] hover:border-[#3A3B3D] p-4 rounded-xl space-y-2.5 cursor-pointer transition-all border-l-4 border-l-[#8AB4F8]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-[#E3E2E3]">
                        <span className="text-[#8AB4F8] font-mono shrink-0">{ev.time}</span>
                        <span className="text-sm truncate">{ev.title}</span>
                        {priorityBadge}
                      </div>
                      <span className="bg-[#1A73E8]/15 text-[#8AB4F8] border border-[#1A73E8]/30 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8AB4F8]" />
                        <span>{language === 'vi' ? 'Sự kiện' : 'Event'}</span>
                      </span>
                    </div>

                    {ev.location && (
                      <div className="bg-[#191A1B] border border-[#2A2B2D] p-2.5 rounded-lg text-xs flex items-center justify-between text-[#9AA0A6]">
                        <div className="flex items-center gap-1.5 text-[#E3E2E3]">
                          <MapPin className="w-3.5 h-3.5 text-[#81C995]" />
                          <span>{ev.location}</span>
                        </div>
                        {ev.alertTime && (
                          <div className="flex items-center gap-1 text-[11px] text-[#FDD663]">
                            <Clock className="w-3 h-3" />
                            <span>{ev.alertTime}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
};
