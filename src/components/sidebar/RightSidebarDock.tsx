import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PanelRightOpen, PanelRightClose, CheckSquare, Lightbulb, Users } from 'lucide-react';

export const RightSidebarDock: React.FC = () => {
  const { isRightSidebarOpen, rightSidebarTab, openRightSidebarTab, toggleRightSidebar, tasksData } = useApp();
  const { t } = useLanguage();

  const pendingCount = tasksData.filter((t) => !t.completed).length;

  return (
    <div className="w-14 flex-shrink-0 h-full border-l border-[#2A2B2D] bg-[#171819] flex flex-col items-center justify-start py-3 px-1.5 z-20 select-none space-y-4">
      {/* 1. Google Tasks Companion App Icon */}
      <button
        onClick={() => openRightSidebarTab('tasks')}
        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center group cursor-pointer relative ${
          isRightSidebarOpen && rightSidebarTab === 'tasks'
            ? 'bg-[#1A73E8]/20 text-[#8AB4F8] ring-1 ring-[#1A73E8]'
            : 'hover:bg-[#28292A] text-[#9AA0A6]'
        }`}
        title={t('sidebar.dockTasks') || 'Google Tasks'}
      >
        <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
          <CheckSquare className="w-4 h-4" />
        </div>
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#EA4335] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
        {isRightSidebarOpen && rightSidebarTab === 'tasks' && (
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#1A73E8]" />
        )}
      </button>

      {/* 2. Google Keep & Routine Icon (Lucide Lightbulb) */}
      <button
        onClick={() => openRightSidebarTab('notes-routine')}
        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center cursor-pointer group relative ${
          isRightSidebarOpen && rightSidebarTab === 'notes-routine'
            ? 'bg-[#FDD663]/20 ring-1 ring-[#FDD663]/50'
            : 'hover:bg-[#28292A]'
        }`}
        title="Ghi chú & Routine"
      >
        <div className="w-7 h-7 rounded-full bg-[#FDD663]/15 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Lightbulb className="w-4 h-4 text-[#FDD663]" />
        </div>
        {isRightSidebarOpen && rightSidebarTab === 'notes-routine' && (
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#FDD663]" />
        )}
      </button>

      {/* 3. Google Contacts Icon (Lucide Users) */}
      <button
        onClick={() => openRightSidebarTab('contacts')}
        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center cursor-pointer group relative ${
          isRightSidebarOpen && rightSidebarTab === 'contacts'
            ? 'bg-[#81C995]/20 ring-1 ring-[#81C995]/50'
            : 'hover:bg-[#28292A]'
        }`}
        title="Danh bạ & Nhóm"
      >
        <div className="w-7 h-7 rounded-full bg-[#81C995]/15 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Users className="w-4 h-4 text-[#81C995]" />
        </div>
        {isRightSidebarOpen && rightSidebarTab === 'contacts' && (
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#81C995]" />
        )}
      </button>

      <div className="w-6 h-[1px] bg-[#2A2B2D]" />

      {/* 4. Expand / Collapse Button */}
      <button
        onClick={toggleRightSidebar}
        className="w-8 h-8 rounded-full hover:bg-[#28292A] text-[#9AA0A6] hover:text-[#E3E2E3] flex items-center justify-center transition-colors cursor-pointer mt-auto"
        title={isRightSidebarOpen ? (t('sidebar.collapseRight') || 'Thu gọn bảng') : (t('sidebar.expandRight') || 'Mở rộng bảng')}
      >
        {isRightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
      </button>
    </div>
  );
};

