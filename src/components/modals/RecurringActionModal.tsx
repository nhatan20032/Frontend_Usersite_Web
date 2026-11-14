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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] max-w-md w-full rounded-2xl p-6 space-y-5 relative shadow-2xl text-[var(--text-primary)]">
        <button
          onClick={closeRecurringModal}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#242527] border border-[var(--border-subtle)] text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>Sự kiện lặp lại (Recurrence)</span>
            </span>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Xóa sự kiện trong chuỗi
            </h3>
          </div>
        </div>

        {/* Target summary */}
        <div className="bg-[var(--surface-canvas)] border border-[var(--border-grid)] p-3 rounded-xl space-y-1 text-xs">
          <p className="font-medium text-[var(--text-primary)] truncate">
            {activeRecurringEvent.title}
          </p>
          <p className="text-[var(--text-secondary)] text-[11px]">
            Tần suất: <span className="font-medium text-[var(--google-blue)]">{activeRecurringEvent.frequency || 'Lặp lại'}</span>
          </p>
        </div>

        {/* Google Calendar style Choice Selector */}
        <div className="space-y-2 text-xs">
          <label
            onClick={() => setDeleteScope('single')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              deleteScope === 'single'
                ? 'border-rose-500/80 bg-rose-500/10 text-[var(--text-primary)]'
                : 'border-[var(--border-grid)] bg-[var(--surface-canvas)] hover:border-[#3C4043] text-[var(--text-secondary)]'
            }`}
          >
            <input
              type="radio"
              name="deleteScope"
              checked={deleteScope === 'single'}
              onChange={() => setDeleteScope('single')}
              className="mt-0.5 text-rose-500 focus:ring-0"
            />
            <div>
              <div className="font-semibold text-[var(--text-primary)]">Chỉ sự kiện này</div>
              <div className="text-[11px] text-[var(--text-secondary)] font-normal">
                Chỉ xóa sự kiện của ngày {activeRecurringEvent.day}/{activeRecurringEvent.month + 1}. Các ngày khác vẫn giữ nguyên.
              </div>
            </div>
          </label>

          <label
            onClick={() => setDeleteScope('all')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              deleteScope === 'all'
                ? 'border-rose-500/80 bg-rose-500/10 text-[var(--text-primary)]'
                : 'border-[var(--border-grid)] bg-[var(--surface-canvas)] hover:border-[#3C4043] text-[var(--text-secondary)]'
            }`}
          >
            <input
              type="radio"
              name="deleteScope"
              checked={deleteScope === 'all'}
              onChange={() => setDeleteScope('all')}
              className="mt-0.5 text-rose-500 focus:ring-0"
            />
            <div>
              <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Tất cả sự kiện trong chuỗi</span>
                <span className="text-[11px] bg-[var(--surface-container-high)] text-rose-400 border border-[var(--border-subtle)] px-2 py-0.5 rounded-full font-semibold">
                  {sameSeriesCount} ngày
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-normal">
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
            className="flex-1 bg-[var(--surface-container-high)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-full text-xs shadow transition-colors cursor-pointer"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
