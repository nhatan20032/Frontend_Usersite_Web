import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Priority } from '../../types';
import { X, MapPin } from 'lucide-react';

export const CreateEventModal: React.FC = () => {
  const { activeModal, closeModal, addEvent, selectedDay, selectedMonth, selectedYear } = useApp();
  const { language, t } = useLanguage();

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'routine' | 'event' | 'task'>('routine');
  const [priority, setPriority] = useState<Priority>('medium');
  const [frequency, setFrequency] = useState<string>('daily');
  const [location, setLocation] = useState<string>('');

  if (activeModal !== 'create') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const freqText =
      frequency === 'daily'
        ? (language === 'vi' ? 'Hàng ngày' : 'Daily')
        : frequency === 'weekly'
        ? (language === 'vi' ? 'Hàng tuần' : 'Weekly')
        : (language === 'vi' ? 'Cứ 3 ngày 1 lần' : 'Every 3 days');

    const success = addEvent({
      type: type === 'task' ? 'routine' : type,
      title: title.trim(),
      time: '08:00 AM',
      priority,
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      streak: 1,
      completed: false,
      location: location.trim() || (language === 'vi' ? 'Hà Nội' : 'HQ Office'),
      travelTime: language === 'vi' ? '20 phút' : '20 mins',
      alertTime: language === 'vi' ? 'Trước 25p' : '25 mins before',
      frequency: freqText,
    });

    if (success) {
      closeModal();
      setTitle('');
      setLocation('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-lg w-full rounded-[28px] p-6 sm:p-8 space-y-5 relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="apple-glass-pill text-blue-600 dark:text-sky-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            {t('common.createNew')}
          </span>
          <h3 className="text-lg font-bold app-text-primary pt-1">{t('modals.create.title')}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold app-text-primary">{t('modals.create.titleLabel')}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('modals.create.titlePlaceholder')}
              className="w-full apple-input px-3.5 py-2.5 text-xs focus:bg-white dark:focus:bg-slate-900 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">{t('modals.create.typeLabel')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'routine' | 'event' | 'task')}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="routine">{t('modals.create.routineType')}</option>
                <option value="event">{t('modals.create.eventType')}</option>
                <option value="task">{t('common.task')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">{t('modals.create.priorityLabel')}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="high">{t('common.high')}</option>
                <option value="medium">{t('common.medium')}</option>
                <option value="low">{t('common.low')}</option>
              </select>
            </div>
          </div>

          {/* Routine Frequency */}
          {type === 'routine' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold app-text-primary">{t('modals.create.frequencyLabel')}</label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  {language === 'vi' ? 'Gói Free: Hàng ngày/tuần' : 'Free Tier: Daily/Weekly'}
                </span>
              </div>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="daily">{t('modals.create.frequencyDaily')}</option>
                <option value="weekly">{t('modals.create.frequencyWeekly')}</option>
                <option value="interval">{language === 'vi' ? 'Cứ 3 ngày 1 lần (VIP)' : 'Every 3 days (VIP)'}</option>
                <option value="monthly">{language === 'vi' ? 'Ngày cố định trong tháng (VIP)' : 'Monthly fixed date (VIP)'}</option>
              </select>
            </div>
          )}

          {/* Event Location */}
          {type === 'event' && (
            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">
                {t('modals.create.locationLabel')}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('modals.create.locationPlaceholder')}
                  className="w-full apple-input pl-10 pr-3.5 py-2.5 text-xs font-sans"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="space-y-2 border-t app-border pt-3">
            <label className="font-semibold app-text-primary">{t('modals.create.alertTimeLabel')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
                <span>Push App</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>SMS</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>Voice Call</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 apple-glass-pill hover:bg-slate-200/80 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white py-2.5 rounded-2xl font-bold transition-all cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 apple-btn-primary font-bold py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
