import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { CalendarEvent } from '../../types';
import {
  X,
  CalendarCheck2,
  Plus,
  Flame,
  Check,
  MapPin,
  Clock,
  Navigation,
  Trash2,
  Sparkles,
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

export const DayInspectorDrawer: React.FC = () => {
  const { isPremium } = useAuth();
  const {
    eventsData,
    selectedDay,
    selectedMonth,
    selectedYear,
    categoryFilters,
    isDayInspectorOpen,
    closeDayInspector,
    toggleCheckInRoutine,
    deleteEvent,
    openRecurringModal,
    openModal,
    triggerPremiumFeature,
  } = useApp();
  const { language, t } = useLanguage();

  if (!isDayInspectorOpen) return null;

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;
  const targetDate = new Date(selectedYear, selectedMonth, selectedDay);
  const weekdayName = targetDate.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long' });

  const dayEvents = eventsData.filter((e) => {
    if (e.year !== selectedYear || e.month !== selectedMonth || e.day !== selectedDay) return false;
    if (e.type === 'routine' && !categoryFilters.routine) return false;
    if (e.type === 'event' && !categoryFilters.event) return false;
    return true;
  });

  const handleDeleteItem = (targetEvent: CalendarEvent) => {
    const isRecurring = Boolean(targetEvent.seriesId || (targetEvent.frequency && targetEvent.frequency !== 'Một lần'));
    const sameCount = targetEvent.seriesId
      ? eventsData.filter((e) => e.seriesId === targetEvent.seriesId).length
      : eventsData.filter((e) => e.title === targetEvent.title && e.type === targetEvent.type).length;

    if (isRecurring && sameCount > 1) {
      openRecurringModal(targetEvent, 'delete');
    } else {
      deleteEvent(Number(targetEvent.id));
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={closeDayInspector} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-[#1F2021] border-l border-[#2A2B2D] shadow-2xl h-full flex flex-col p-5 space-y-4 animate-in slide-in-from-right duration-250 z-50 select-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2A2B2D] pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-[#8AB4F8] flex items-center gap-1.5 uppercase tracking-wider">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>{weekdayName}</span>
            </span>
            <h3 className="text-lg font-bold text-[#E3E2E3]">
              {language === 'vi'
                ? `Ngày ${selectedDay} ${monthNames[selectedMonth]}, ${selectedYear}`
                : `${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`}
            </h3>
            <p className="text-xs text-[#9AA0A6]">
              {dayEvents.length > 0
                ? `${dayEvents.length} ${language === 'vi' ? 'lịch trình & thói quen' : 'events & routines'}`
                : (language === 'vi' ? 'Chưa có lịch trình cho ngày này' : 'No schedules for this day')}
            </p>
          </div>

          <button
            onClick={closeDayInspector}
            className="p-1.5 rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => {
            openModal('create');
          }}
          className="w-full bg-[#1A73E8] hover:bg-[#1B66CA] text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('sidebar.addSchedule')} ({selectedDay}/{selectedMonth + 1})</span>
        </button>

        {/* Day's Event and Routine List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {dayEvents.length === 0 ? (
            <div className="bg-[#161718] border border-[#2A2B2D] p-8 text-center rounded-xl space-y-2.5 my-auto">
              <div className="w-10 h-10 rounded-full bg-[#242527] text-[#8AB4F8] flex items-center justify-center mx-auto border border-[#333538]">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#9AA0A6]">
                {language === 'vi' ? 'Không có thói quen hoặc sự kiện nào trong ngày này.' : 'No habits or events scheduled for this day.'}
              </p>
              <button
                onClick={() => openModal('create')}
                className="text-xs text-[#8AB4F8] hover:text-[#AECBFA] font-semibold hover:underline cursor-pointer"
              >
                + {language === 'vi' ? 'Thêm lịch trình hoặc thói quen ngay' : 'Add event or habit now'}
              </button>
            </div>
          ) : (
            dayEvents.map((ev) => {
              const isRoutine = ev.type === 'routine';

              return (
                <div
                  key={ev.id}
                  className={`bg-[#242527] border border-[#333538] hover:border-[#3A3B3D] p-3.5 rounded-xl space-y-2 transition-all border-l-4 ${
                    isRoutine ? 'border-l-[#FDD663]' : 'border-l-[#8AB4F8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#FDD663]">
                          {ev.time || '08:00 AM'}
                        </span>
                        <h4 className="font-semibold text-sm text-[#E3E2E3] truncate">{ev.title}</h4>
                        {ev.priority === 'high' && (
                          <span className="text-[9px] bg-[#D93025] text-white font-bold px-1.5 py-0.5 rounded shadow-xs">
                            {t('common.high')}
                          </span>
                        )}
                      </div>

                      {ev.frequency && (
                        <p className="text-[11px] text-[#9AA0A6] flex items-center gap-1">
                          <span>🔄 {ev.frequency}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(ev)}
                      className="p-1 text-[#70757A] hover:text-[#F28B82] hover:bg-[#28292A] rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location & Travel if event */}
                  {ev.location && (
                    <div className="bg-[#1A1B1D] border border-[#2A2B2D] p-2 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-[#81C995]">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                      {ev.travelTime && (
                        <div className="flex items-center justify-between text-[10px] text-[#9AA0A6] pt-1 border-t border-[#2A2B2D]">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-[#8AB4F8]" />
                            <span>Di chuyển: {ev.travelTime}</span>
                          </span>
                          {ev.alertTime && (
                            <span className="flex items-center gap-1 text-[#FDD663]">
                              <Clock className="w-3 h-3" />
                              <span>Nhắc: {ev.alertTime}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Checkin Action for Routines */}
                  {isRoutine && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-medium text-[#FDD663] flex items-center gap-1 font-mono">
                        <Flame className="w-3.5 h-3.5 text-[#FDD663]" />
                        <span>Streak: {ev.streak || 0} {t('common.days')}</span>
                      </span>

                      {ev.isPremium && !isPremium ? (
                        <button
                          onClick={() => triggerPremiumFeature(ev.title)}
                          className="bg-[#FDD663]/15 text-[#FDD663] border border-[#FDD663]/30 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Mở khóa
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCheckInRoutine(Number(ev.id))}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            ev.completed
                              ? 'bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/40'
                              : 'bg-[#1A73E8] hover:bg-[#1B66CA] text-white shadow-xs'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{ev.completed ? (language === 'vi' ? 'Đã điểm danh' : 'Checked In') : (language === 'vi' ? 'Điểm danh' : 'Check In')}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
