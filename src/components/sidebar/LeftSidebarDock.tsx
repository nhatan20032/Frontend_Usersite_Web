import React from 'react';
import { useApp } from '../../context/AppContext';
import { PanelLeftOpen } from 'lucide-react';

export const LeftSidebarDock: React.FC = () => {
  const { isLeftSidebarOpen, toggleLeftSidebar } = useApp();

  if (isLeftSidebarOpen) return null;

  return (
    <div className="flex-shrink-0 h-full border-r app-border apple-glass-surface flex flex-col items-center justify-start py-4 px-1.5 z-20 transition-all">
      <button
        onClick={toggleLeftSidebar}
        className="p-2.5 apple-glass-pill hover:bg-blue-600 hover:text-white app-text-primary rounded-2xl shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
        title="Mở rộng Sidebar Trái"
      >
        <PanelLeftOpen className="w-4 h-4 text-blue-600 dark:text-sky-400 group-hover:text-white transition-colors" />
        <span className="text-[10px] font-bold tracking-widest [writing-mode:vertical-lr] rotate-180 uppercase py-2">
          Lịch & Bộ lọc
        </span>
      </button>
    </div>
  );
};
