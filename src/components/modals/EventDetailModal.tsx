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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#1F2021] border border-[#333538] max-w-md w-full rounded-2xl p-6 space-y-4 relative shadow-2xl text-[#E3E2E3]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#9AA0A6] hover:text-[#E3E2E3] p-1.5 rounded-full hover:bg-[#28292A] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-[#2A2B2D] pb-3 pr-8">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold shadow-xs ${
                isRoutine
                  ? 'bg-[#E37400] text-white'
                  : 'bg-[#1A73E8] text-white'
              }`}
            >
              {isRoutine ? (language === 'vi' ? 'THÓI QUEN' : 'ROUTINE') : (language === 'vi' ? 'SỰ KIỆN' : 'EVENT')}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                event.priority === 'high'
                  ? 'bg-[#D93025] text-white'
                  : event.priority === 'medium'
                  ? 'bg-[#E37400] text-white'
                  : 'bg-[#28292A] text-[#9AA0A6] border border-[#333538]'
              }`}
            >
              {event.priority === 'high' ? t('common.high') : event.priority === 'medium' ? t('common.medium') : t('common.low')}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#E3E2E3] pt-0.5 leading-snug">{event.title}</h3>
        </div>

        {/* Event Details Content */}
        <div className="space-y-3 text-xs text-[#E3E2E3]">
          <div className="flex items-center gap-2.5 text-[#9AA0A6]">
            <Clock className="w-4 h-4 text-[#8AB4F8] shrink-0" />
            <span className="text-[#E3E2E3]">
              {language === 'vi'
                ? `Thời gian: ${event.time} (Ngày ${event.day} ${monthNames[selectedMonth]})`
                : `Time: ${event.time} (${monthNames[selectedMonth]} ${event.day})`}
            </span>
          </div>

          {isRoutine ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#FDD663] shrink-0" />
                <span>
                  {language === 'vi' ? 'Chuỗi kỷ luật Streak: ' : 'Discipline Streak: '}
                  <b className="text-[#FDD663] font-mono">{event.streak || 1} {t('common.days')}</b>
                </span>
              </div>
              {event.frequency && (
                <div className="text-[11px] text-[#9AA0A6] bg-[#161718] border border-[#2A2B2D] p-2 rounded-lg">
                  🔄 {language === 'vi' ? 'Tần suất lặp lại:' : 'Frequency:'} <span className="text-[#E3E2E3] font-medium">{event.frequency}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {event.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#81C995] shrink-0" />
                  <span>
                    {t('modals.detail.location')}: <b className="text-[#E3E2E3]">{event.location}</b>
                  </span>
                </div>
              )}

              {(event.travelTime || event.alertTime) && (
                <div className="bg-[#161718] border border-[#2A2B2D] p-3 rounded-xl space-y-2 text-xs text-[#9AA0A6]">
                  {event.travelTime && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#8AB4F8]" />
                        <span>{language === 'vi' ? 'Thời gian di chuyển ước tính' : 'Estimated Travel Time'}</span>
                      </span>
                      <span className="font-semibold text-[#81C995] font-mono">{event.travelTime}</span>
                    </div>
                  )}
                  {event.alertTime && (
                    <div className="text-[11px] text-[#E3E2E3] bg-[#242527] border border-[#333538] p-2.5 rounded-lg flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#9AA0A6]">
                        <Bell className="w-3.5 h-3.5 text-[#FDD663]" />
                        <span>{t('modals.detail.reminder')}</span>
                      </span>
                      <span className="font-medium text-[#FDD663]">{event.alertTime}</span>
                    </div>
                  )}
                </div>
              )}

              {event.description && (
                <div className="bg-[#161718] border border-[#2A2B2D] p-2.5 rounded-lg text-xs text-[#9AA0A6] space-y-1">
                  <span className="text-[10px] text-[#70757A] uppercase font-semibold block">{language === 'vi' ? 'Ghi chú' : 'Description'}</span>
                  <p className="text-[#E3E2E3] whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#2A2B2D]">
          <button
            onClick={handleDelete}
            className="bg-[#28292A] hover:bg-[#D93025] text-[#F28B82] hover:text-white border border-[#3A3B3D] hover:border-transparent font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('common.delete')}</span>
          </button>
          <button
            onClick={closeModal}
            className="flex-1 bg-[#28292A] hover:bg-[#333538] text-[#E3E2E3] font-semibold py-2 rounded-lg text-xs border border-[#3A3B3D] transition-colors cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
