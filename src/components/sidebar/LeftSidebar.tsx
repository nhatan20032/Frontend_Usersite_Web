import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MiniCalendarPicker } from '../ui/MiniCalendarPicker';
import { PanelLeftClose } from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { currentRole } = useAuth();
  const { isLeftSidebarOpen, toggleLeftSidebar, categoryFilters, setCategoryFilters, openModal } = useApp();
  const { t, language } = useLanguage();

  const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState(false);
  const createMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    if (isCreateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen]);

  const handleSelectCreateType = (type: 'event' | 'task' | 'appointment') => {
    setIsCreateMenuOpen(false);
    if (type === 'appointment') {
      openModal('appointment-schedule');
    } else {
      openModal('create');
    }
  };

  return (
    <aside
      id="leftSidebar"
      className={`w-64 border-r border-[#2A2B2D] bg-[#121314] p-3 space-y-4 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition select-none ${
        !isLeftSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* 1. Google Style Create Pill Button & Dropdown Menu */}
      <div className="pt-1 flex items-center justify-between gap-2 relative" ref={createMenuRef}>
        <button
          onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
          className="bg-[#28292A] hover:bg-[#333538] border border-[#3A3B3D] text-[#E3E2E3] font-medium py-2.5 px-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-sm cursor-pointer active:scale-98 flex-1"
        >
          {/* Multi-color Google Plus icon representation */}
          <div className="w-4 h-4 flex items-center justify-center relative">
            <span className="w-3.5 h-0.5 bg-[#EA4335] rounded-full absolute" />
            <span className="w-0.5 h-3.5 bg-[#4285F4] rounded-full absolute" />
          </div>
          <span>{language === 'vi' ? 'Tạo' : 'Create'}</span>
          <span className="text-[#9AA0A6] text-xs ml-auto transition-transform duration-200" style={{ transform: isCreateMenuOpen ? 'rotate(180deg)' : 'none' }}>
            ▾
          </span>
        </button>

        <button
          onClick={toggleLeftSidebar}
          className="p-2 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
          title={language === 'vi' ? 'Thu gọn bảng' : 'Collapse panel'}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Dropdown Menu (Ảnh 3) */}
        {isCreateMenuOpen && (
          <div className="absolute left-0 top-14 w-56 bg-[#242628] border border-[#3C4043] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => handleSelectCreateType('event')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#303336] transition-colors text-left text-[#E3E2E3] group cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{language === 'vi' ? 'Sự kiện' : 'Event'}</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectCreateType('task')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#303336] transition-colors text-left text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#81C995]" />
              <span className="text-xs font-medium">{language === 'vi' ? 'Việc cần làm' : 'Task'}</span>
            </button>

            <button
              onClick={() => handleSelectCreateType('appointment')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-[#303336] transition-colors text-left text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FDD663]" />
                <span className="text-xs font-medium">{language === 'vi' ? 'Lên lịch hẹn' : 'Appointment schedule'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#01552C] text-[#8ED7A1] text-[10px] font-semibold">
                {language === 'vi' ? 'MỚI' : 'NEW'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Mini Calendar Picker Component */}
      <MiniCalendarPicker />

      {/* 3. Search People Filter Input */}
      <div className="space-y-1">
        <input
          type="text"
          placeholder={language === 'vi' ? 'Tìm người...' : 'Search people...'}
          className="w-full bg-[#1F2021] border border-[#2A2B2D] focus:border-[#8AB4F8] text-[#E3E2E3] rounded-md px-3 py-1.5 text-xs placeholder-[#70757A] transition-all focus:outline-none"
        />
      </div>

      {/* 4. My Calendars Checklist */}
      <div className="space-y-2 text-xs flex-1">
        <div className="flex items-center justify-between text-[#9AA0A6] font-semibold text-[11px] uppercase tracking-wider px-1">
          <span>{language === 'vi' ? 'Lịch của tôi' : 'My Calendars'}</span>
          <span className="text-[10px] cursor-pointer hover:text-white">▾</span>
        </div>

        <div className="space-y-1.5 px-1">
          {/* Routine category */}
          <label className="flex items-center gap-3 text-[#E3E2E3] cursor-pointer py-1 px-1.5 rounded hover:bg-[#1F2021] transition-colors">
            <input
              type="checkbox"
              checked={categoryFilters.routine}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, routine: e.target.checked }))}
              className="w-4 h-4 rounded text-amber-500 bg-[#28292A] border-[#3A3B3D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-500"
            />
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="truncate">{t('sidebar.routineCategory')}</span>
            </span>
          </label>

          {/* Event category */}
          <label className="flex items-center gap-3 text-[#E3E2E3] cursor-pointer py-1 px-1.5 rounded hover:bg-[#1F2021] transition-colors">
            <input
              type="checkbox"
              checked={categoryFilters.event}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, event: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-500 bg-[#28292A] border-[#3A3B3D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
            />
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate">{t('sidebar.eventCategory')}</span>
            </span>
          </label>

          {/* Task category */}
          <label className="flex items-center gap-3 text-[#E3E2E3] cursor-pointer py-1 px-1.5 rounded hover:bg-[#1F2021] transition-colors">
            <input
              type="checkbox"
              checked={categoryFilters.task}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, task: e.target.checked }))}
              className="w-4 h-4 rounded text-[#1A73E8] bg-[#28292A] border-[#3A3B3D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#1A73E8]"
            />
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] flex-shrink-0" />
              <span className="truncate">{t('sidebar.taskCategory')}</span>
            </span>
          </label>
        </div>

        {/* Other Calendars Checklist */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[#9AA0A6] font-semibold text-[11px] uppercase tracking-wider px-1 pb-1">
            <span>{language === 'vi' ? 'Lịch khác' : 'Other Calendars'}</span>
            <span className="text-[10px] cursor-pointer hover:text-white">▾</span>
          </div>
          <div className="space-y-1.5 px-1">
            <label className="flex items-center gap-3 text-[#E3E2E3] cursor-pointer py-1 px-1.5 rounded hover:bg-[#1F2021] transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-[#1E8E3E] bg-[#28292A] border-[#3A3B3D] cursor-pointer accent-[#1E8E3E]"
              />
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E3E] flex-shrink-0" />
                <span className="truncate text-xs">{language === 'vi' ? 'Ngày lễ tại Việt Nam' : 'Holidays in Vietnam'}</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Sync / Plan Status Footer */}
      <div className="pt-2 border-t border-[#2A2B2D] text-[11px] text-[#70757A] flex items-center justify-between flex-shrink-0 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{language === 'vi' ? 'Đã đồng bộ' : 'Synced'}</span>
        </span>
        <span className="font-semibold text-[#9AA0A6]">
          {currentRole === 'FREE' ? 'FREE' : 'VIP 👑'}
        </span>
      </div>
    </aside>
  );
};
