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
  Crown,
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
    <div className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={closeDayInspector} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-[#1F2021] border-l border-[#2A2B2D] shadow-2xl h-full flex flex-col p-6 space-y-5 animate-in slide-in-from-right duration-300 z-50 select-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2A2B2D] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8AB4F8] flex items-center gap-1.5">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>{weekdayName}</span>
            </span>
            <h3 className="text-xl font-bold text-[#E3E2E3]">
              {language === 'vi'
                ? `Ngày ${selectedDay} ${monthNames[selectedMonth]}, ${selectedYear}`
                : `${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`}
            </h3>
            <p className="text-xs text-[#9AA0A6]">
              {dayEvents.length > 0
                ? `${dayEvents.length} lịch trình & thói quen trong ngày`
                : 'Chưa có lịch trình cho ngày này'}
            </p>
          </div>

          <button
            onClick={closeDayInspector}
            className="p-2 rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => {
            openModal('create');
          }}
          className="w-full apple-btn-primary font-bold py-2.5 px-4 rounded-2xl shadow-md shadow-blue-500/20 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('sidebar.addSchedule')} ({selectedDay}/{selectedMonth + 1})</span>
        </button>

        {/* Day's Event and Routine List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {dayEvents.length === 0 ? (
            <div className="apple-glass-card p-8 text-center rounded-3xl space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold app-text-secondary">
                Không có thói quen hoặc sự kiện nào trong ngày này.
              </p>
              <button
                onClick={() => openModal('create')}
                className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                + Thêm thói quen ngay
              </button>
            </div>
          ) : (
            dayEvents.map((ev) => {
              const isRoutine = ev.type === 'routine';

              return (
                <div
                  key={ev.id}
                  className={`apple-glass-card p-4 rounded-2xl border-l-4 space-y-2.5 transition-all ${
                    isRoutine ? 'border-l-amber-500' : 'border-l-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                          {ev.time || '08:00 AM'}
                        </span>
                        <h4 className="font-bold text-sm app-text-primary truncate">{ev.title}</h4>
                        {ev.priority === 'high' && (
                          <span className="text-[9px] bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
                            CAO
                          </span>
                        )}
                        {ev.isPremium && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> PRO
                          </span>
                        )}
                      </div>

                      {ev.frequency && (
                        <p className="text-[11px] app-text-muted flex items-center gap-1">
                          <span>🔄 Lặp lại: {ev.frequency}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(ev)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location & Travel if event */}
                  {ev.location && (
                    <div className="apple-glass-pill p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                      {ev.travelTime && (
                        <div className="flex items-center justify-between text-[10px] app-text-muted pt-1 border-t app-border">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-blue-500" />
                            <span>Di chuyển: {ev.travelTime}</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <Clock className="w-3 h-3" />
                            <span>Nhắc: {ev.alertTime}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Checkin Action for Routines */}
                  {isRoutine && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Streak: {ev.streak || 0} ngày</span>
                      </span>

                      {ev.isPremium && !isPremium ? (
                        <button
                          onClick={() => triggerPremiumFeature(ev.title)}
                          className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Crown className="w-3 h-3" />
                          <span>Mở khóa PRO</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCheckInRoutine(Number(ev.id))}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            ev.completed
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40'
                              : 'apple-btn-primary shadow-xs'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{ev.completed ? 'Đã điểm danh ✓' : 'Điểm danh ngay'}</span>
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
