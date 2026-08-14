import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, X, RefreshCw } from 'lucide-react';

export const RecurringActionModal: React.FC = () => {
  const {
    activeModal,
    activeRecurringEvent,
    recurringActionType,
    closeRecurringModal,
    closeDayInspector,
    deleteEvent,
    eventsData,
  } = useApp();

  const [deleteScope, setDeleteScope] = useState<'single' | 'all'>('all');

  if (activeModal !== 'recurring-action' || !activeRecurringEvent) return null;

  const sameSeriesCount = activeRecurringEvent.seriesId
    ? eventsData.filter((e) => e.seriesId === activeRecurringEvent.seriesId).length
    : eventsData.filter((e) => e.title === activeRecurringEvent.title && e.type === activeRecurringEvent.type).length;

  const handleConfirm = () => {
    if (recurringActionType === 'delete') {
      deleteEvent(Number(activeRecurringEvent.id), deleteScope === 'all');
      if (deleteScope === 'all') {
        closeDayInspector();
      }
    }
    closeRecurringModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-md w-full rounded-[28px] p-6 sm:p-8 space-y-5 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={closeRecurringModal}
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>Sự kiện lặp lại (Recurrence)</span>
            </span>
            <h3 className="text-base sm:text-lg font-extrabold app-text-primary">
              Xóa sự kiện trong chuỗi
            </h3>
          </div>
        </div>

        {/* Target summary */}
        <div className="apple-glass-card p-3 rounded-2xl space-y-1 text-xs">
          <p className="font-bold app-text-primary truncate">
            {activeRecurringEvent.title}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Tần suất: <span className="font-semibold text-amber-600">{activeRecurringEvent.frequency || 'Lặp lại'}</span>
          </p>
        </div>

        {/* Google Calendar style Choice Selector */}
        <div className="space-y-2.5 text-xs font-semibold">
          <label
            onClick={() => setDeleteScope('single')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              deleteScope === 'single'
                ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                : 'app-border apple-glass-pill hover:border-slate-400 text-slate-700 dark:text-slate-300'
            }`}
          >
            <input
              type="radio"
              name="deleteScope"
              checked={deleteScope === 'single'}
              onChange={() => setDeleteScope('single')}
              className="mt-0.5 text-rose-600"
            />
            <div>
              <div className="font-bold">Chỉ sự kiện này</div>
              <div className="text-[11px] opacity-75 font-normal">
                Chỉ xóa sự kiện của ngày {activeRecurringEvent.day}/{activeRecurringEvent.month + 1}. Các ngày khác vẫn giữ nguyên.
              </div>
            </div>
          </label>

          <label
            onClick={() => setDeleteScope('all')}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              deleteScope === 'all'
                ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                : 'app-border apple-glass-pill hover:border-slate-400 text-slate-700 dark:text-slate-300'
            }`}
          >
            <input
              type="radio"
              name="deleteScope"
              checked={deleteScope === 'all'}
              onChange={() => setDeleteScope('all')}
              className="mt-0.5 text-rose-600"
            />
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>Tất cả sự kiện trong chuỗi</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-extrabold">
                  {sameSeriesCount} ngày
                </span>
              </div>
              <div className="text-[11px] opacity-75 font-normal">
                Dọn dẹp và xóa toàn bộ tất cả các ngày lặp lại của sự kiện này trong lịch.
              </div>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={closeRecurringModal}
            className="flex-1 apple-glass-pill hover:bg-slate-200/80 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-2xl text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
