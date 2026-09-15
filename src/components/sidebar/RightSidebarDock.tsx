import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PanelRightOpen, CheckSquare } from 'lucide-react';

export const RightSidebarDock: React.FC = () => {
  const { isRightSidebarOpen, toggleRightSidebar, tasksData } = useApp();
  const { t } = useLanguage();

  if (isRightSidebarOpen) return null;

  const pendingCount = tasksData.filter((t) => !t.completed).length;

  return (
    <div className="w-14 flex-shrink-0 h-full border-l border-[#2A2B2D] bg-[#121314] flex flex-col items-center justify-start py-3 px-1.5 z-20 select-none space-y-4">
      {/* 1. Google Tasks Companion App Icon */}
      <button
        onClick={toggleRightSidebar}
        className="w-10 h-10 rounded-full hover:bg-[#28292A] transition-all flex items-center justify-center group cursor-pointer relative"
        title={t('sidebar.dockTasks') || 'Google Tasks'}
      >
        <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
          <CheckSquare className="w-4 h-4" />
        </div>
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#F28B82] text-[#121314] text-[9px] font-extrabold flex items-center justify-center shadow-xs">
            {pendingCount > 99 ? '99+' : pendingCount}
          </span>
        )}
      </button>

      {/* 2. Google Keep Note Placeholder Icon */}
      <button
        onClick={toggleRightSidebar}
        className="w-10 h-10 rounded-full hover:bg-[#28292A] transition-all flex items-center justify-center cursor-pointer text-[#FDD663] opacity-75 hover:opacity-100"
        title="Ghi chú & Routine"
      >
        <div className="w-7 h-7 rounded-full bg-[#FDD663]/15 flex items-center justify-center">
          <span className="text-xs">💡</span>
        </div>
      </button>

      {/* 3. Google Contacts Placeholder Icon */}
      <button
        onClick={toggleRightSidebar}
        className="w-10 h-10 rounded-full hover:bg-[#28292A] transition-all flex items-center justify-center cursor-pointer text-[#81C995] opacity-75 hover:opacity-100"
        title="Danh bạ & Nhóm"
      >
        <div className="w-7 h-7 rounded-full bg-[#81C995]/15 flex items-center justify-center">
          <span className="text-xs">👥</span>
        </div>
      </button>

      <div className="w-6 h-[1px] bg-[#2A2B2D]" />

      {/* 4. Expand / Open Arrow Button */}
      <button
        onClick={toggleRightSidebar}
        className="w-8 h-8 rounded-full hover:bg-[#28292A] text-[#9AA0A6] hover:text-[#E3E2E3] flex items-center justify-center transition-colors cursor-pointer"
        title={t('sidebar.expandRight') || 'Mở rộng'}
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
    </div>
  );
};

