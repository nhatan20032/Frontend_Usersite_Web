import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CalendarCheck2,
  Calendar as CalendarIcon,
  Flame,
  Crown,
  Check,
  MapPin,
  Navigation,
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
  const { isPremium } = useAuth();
  const {
    eventsData,
    selectedDay,
    selectedMonth,
    selectedYear,
    categoryFilters,
    searchQuery,
    toggleCheckInRoutine,
    openModal,
    triggerPremiumFeature,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm app-text-primary flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span>
            {language === 'vi'
              ? `Lịch trình ngày ${selectedDay} ${monthNames[selectedMonth]} năm ${selectedYear}`
              : `Schedule for ${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`}
          </span>
        </h3>
        <span className="text-xs app-text-muted hidden sm:inline">
          {language === 'vi' ? 'Nhấn vào mục để xem chi tiết hoặc điểm danh' : 'Click an item for details or check-in'}
        </span>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="apple-glass-card p-8 text-center rounded-3xl space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
            <p className="text-xs app-text-secondary font-medium">
              {t('calendar.emptyDayEvents')}
            </p>
            <button
              onClick={() => openModal('create')}
              className="text-blue-600 dark:text-sky-400 font-bold text-xs hover:underline cursor-pointer"
            >
              + {t('sidebar.addSchedule')}
            </button>
          </div>
        ) : (
          filtered.map((ev) => {
            const isRoutine = ev.type === 'routine';
            const isAiEvent = ev.type === 'event';

            let priorityBadge = null;
            if (ev.priority === 'high') {
              priorityBadge = (
                <span className="bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-400/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {t('common.high').toUpperCase()}
                </span>
              );
            } else if (ev.priority === 'medium') {
              priorityBadge = (
                <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {t('common.medium').toUpperCase()}
                </span>
              );
            } else {
              priorityBadge = (
                <span className="apple-glass-pill text-slate-600 dark:text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {t('common.low').toUpperCase()}
                </span>
              );
            }

            if (isRoutine) {
              return (
                <div
                  key={ev.id}
                  onClick={() => openModal('detail', ev.id)}
                  className="apple-glass-card p-4 rounded-3xl border-l-4 border-l-amber-500 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-bold app-text-primary">
                      <span className="text-amber-600 dark:text-amber-400 font-mono flex-shrink-0">{ev.time}</span>
                      <span className="text-sm break-words">{ev.title}</span>
                      <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-mono flex-shrink-0">
                        <Flame className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{ev.streak} {t('common.days')}</span>
                      </span>
                      <span className="flex-shrink-0">{priorityBadge}</span>
                      {ev.isPremium && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase flex-shrink-0">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="app-text-muted text-[11px] line-clamp-2">
                      {ev.frequency || (language === 'vi' ? 'Rèn luyện thói quen kỷ luật mỗi ngày.' : 'Daily discipline routine building.')}
                    </p>
                  </div>

                  {ev.isPremium && !isPremium ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerPremiumFeature(ev.title);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1 min-w-[90px] flex-shrink-0 cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{language === 'vi' ? 'Mở khóa' : 'Unlock'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheckInRoutine(ev.id);
                      }}
                      className={`${
                        ev.completed
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40'
                          : 'apple-btn-primary'
                      } px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 min-w-[124px] flex-shrink-0 cursor-pointer`}
                    >
                      <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{ev.completed ? (language === 'vi' ? 'Đã điểm danh' : 'Checked In') : (language === 'vi' ? 'Điểm danh' : 'Check In')}</span>
                    </button>
                  )}
                </div>
              );
            }

            if (isAiEvent) {
              return (
                <div
                  key={ev.id}
                  onClick={() => openModal('detail', ev.id)}
                  className="apple-glass-card p-4 rounded-3xl border-l-4 border-l-emerald-500 space-y-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold app-text-primary">
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">{ev.time}</span>
                      <span className="text-sm">{ev.title}</span>
                      {priorityBadge}
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-500" /> {language === 'vi' ? 'Bản đồ AI' : 'AI Map'}
                    </span>
                  </div>

                  <div className="apple-glass-pill p-3.5 rounded-2xl text-xs space-y-1.5 app-text-secondary">
                    <div className="flex items-center gap-2 font-bold app-text-primary">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t app-border text-[11px]">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                        <span>{t('modals.detail.travelTime')} <b>{ev.travelTime}</b></span>
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{t('modals.detail.reminder')} {ev.alertTime}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </div>
  );
};
