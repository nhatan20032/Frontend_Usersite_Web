import React from 'react';
import { useApp } from '../../context/AppContext';
import { PanelRightOpen } from 'lucide-react';

export const RightSidebarDock: React.FC = () => {
  const { isRightSidebarOpen, toggleRightSidebar } = useApp();

  if (isRightSidebarOpen) return null;

  return (
    <div className="flex-shrink-0 h-full border-l app-border apple-glass-surface flex flex-col items-center justify-start py-4 px-1.5 z-20 transition-all">
      <button
        onClick={toggleRightSidebar}
        className="p-2.5 apple-glass-pill hover:bg-blue-600 hover:text-white app-text-primary rounded-2xl shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
        title="Mở rộng Cột Công Việc"
      >
        <PanelRightOpen className="w-4 h-4 text-blue-600 dark:text-sky-400 group-hover:text-white transition-colors" />
        <span className="text-[10px] font-bold tracking-widest [writing-mode:vertical-lr] uppercase py-2">
          Công việc
        </span>
      </button>
    </div>
  );
};
