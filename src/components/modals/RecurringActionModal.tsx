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
      <div className="bg-[#1E1F20] border border-[#333538] max-w-md w-full rounded-2xl p-6 space-y-5 relative shadow-2xl text-[#E3E2E3]">
        <button
          onClick={closeRecurringModal}
          className="absolute top-4 right-4 text-[#9AA0A6] hover:text-[#E3E2E3] p-1.5 rounded-full hover:bg-[#28292A] transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#242527] border border-[#333538] text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>Sự kiện lặp lại (Recurrence)</span>
            </span>
            <h3 className="text-base font-semibold text-[#E3E2E3]">
              Xóa sự kiện trong chuỗi
            </h3>
          </div>
        </div>

        {/* Target summary */}
        <div className="bg-[#121314] border border-[#2A2B2D] p-3 rounded-xl space-y-1 text-xs">
          <p className="font-medium text-[#E3E2E3] truncate">
            {activeRecurringEvent.title}
          </p>
          <p className="text-[#9AA0A6] text-[11px]">
            Tần suất: <span className="font-medium text-[#8AB4F8]">{activeRecurringEvent.frequency || 'Lặp lại'}</span>
          </p>
        </div>

        {/* Google Calendar style Choice Selector */}
        <div className="space-y-2 text-xs">
          <label
            onClick={() => setDeleteScope('single')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              deleteScope === 'single'
                ? 'border-rose-500/80 bg-rose-500/10 text-[#E3E2E3]'
                : 'border-[#2A2B2D] bg-[#121314] hover:border-[#3C4043] text-[#9AA0A6]'
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
              <div className="font-semibold text-[#E3E2E3]">Chỉ sự kiện này</div>
              <div className="text-[11px] text-[#9AA0A6] font-normal">
                Chỉ xóa sự kiện của ngày {activeRecurringEvent.day}/{activeRecurringEvent.month + 1}. Các ngày khác vẫn giữ nguyên.
              </div>
            </div>
          </label>

          <label
            onClick={() => setDeleteScope('all')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
              deleteScope === 'all'
                ? 'border-rose-500/80 bg-rose-500/10 text-[#E3E2E3]'
                : 'border-[#2A2B2D] bg-[#121314] hover:border-[#3C4043] text-[#9AA0A6]'
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
              <div className="font-semibold text-[#E3E2E3] flex items-center gap-1.5">
                <span>Tất cả sự kiện trong chuỗi</span>
                <span className="text-[10px] bg-[#28292A] text-rose-400 border border-[#333538] px-2 py-0.5 rounded-full font-semibold">
                  {sameSeriesCount} ngày
                </span>
              </div>
              <div className="text-[11px] text-[#9AA0A6] font-normal">
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
            className="flex-1 bg-[#28292A] hover:bg-[#333538] text-[#9AA0A6] hover:text-[#E3E2E3] py-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
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
