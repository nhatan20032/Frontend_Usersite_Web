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
    <div className="w-12 flex-shrink-0 h-full border-l app-border apple-glass-surface flex flex-col items-center justify-start py-4 px-1.5 z-20 transition-all select-none">
      <button
        onClick={toggleRightSidebar}
        className="w-full py-3 px-1 rounded-2xl apple-glass-pill hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 active:scale-95 flex flex-col items-center gap-3 group cursor-pointer relative"
        title={t('sidebar.expandRight')}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-sky-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25 transition-all duration-300 relative">
          <PanelRightOpen className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 py-1">
          <span className="text-[10px] font-bold tracking-[0.22em] [writing-mode:vertical-rl] uppercase text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
            {t('sidebar.dockTasks')}
          </span>
        </div>

        {/* Floating Tooltip */}
        <div className="absolute right-full mr-3.5 top-2 px-3 py-1.5 rounded-xl apple-glass-modal shadow-xl text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 z-50 flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
          <span className="app-text-primary">{t('sidebar.dockTasksTooltip')}</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

