import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Clock,
  Flame,
  MapPin,
  Navigation,
  Bell,
  Trash2,
} from 'lucide-react';

const monthNamesVi = [
  'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
  'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
  'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12',
];

const monthNamesEn = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
];

export const EventDetailModal: React.FC = () => {
  const { activeModal, activeEventId, closeModal, eventsData, deleteEvent, selectedMonth } = useApp();
  const { language, t } = useLanguage();

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  if (activeModal !== 'detail' || !activeEventId) return null;

  const event = eventsData.find((e) => e.id === activeEventId);
  if (!event) return null;

  const isRoutine = event.type === 'routine';

  const handleDelete = () => {
    deleteEvent(event.id);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-4 relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b app-border pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`apple-glass-pill ${
                isRoutine ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'
              } text-[10px] px-2.5 py-0.5 rounded-full font-bold`}
            >
              {isRoutine ? (language === 'vi' ? 'THÓI QUEN' : 'ROUTINE') : (language === 'vi' ? 'SỰ KIỆN AI' : 'AI EVENT')}
            </span>
            <span className="apple-glass-pill text-rose-600 dark:text-rose-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {event.priority === 'high' ? t('common.high').toUpperCase() : event.priority === 'medium' ? t('common.medium').toUpperCase() : t('common.low').toUpperCase()}
            </span>
          </div>
          <h3 className="text-base font-bold app-text-primary pt-1">{event.title}</h3>
        </div>

        <div className="space-y-3 text-xs app-text-primary">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>
              {language === 'vi'
                ? `Thời gian: ${event.time} (Ngày ${event.day} ${monthNames[selectedMonth]})`
                : `Time: ${event.time} (${monthNames[selectedMonth]} ${event.day})`}
            </span>
          </div>

          {isRoutine ? (
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'vi' ? 'Kỷ luật Streak: ' : 'Discipline Streak: '}
                <b className="text-amber-600 dark:text-amber-400 font-mono">{event.streak || 1} {t('common.days')}</b>
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {t('modals.detail.location')} <b>{event.location || (language === 'vi' ? 'Hà Nội' : 'HQ')}</b>
                </span>
              </div>
              <div className="apple-glass-pill p-3.5 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>{language === 'vi' ? 'Lộ trình: 8.4 km' : 'Distance: 8.4 km'}</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">25 {t('common.minutes')}</span>
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'vi' ? 'Khuyến nghị: Xuất phát lúc 13:35 PM' : 'Suggested departure: 13:35 PM'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleDelete}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('common.delete')}</span>
          </button>
          <button
            onClick={closeModal}
            className="flex-1 apple-btn-primary font-bold py-2.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
