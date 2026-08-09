import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PanelLeftOpen, CalendarDays } from 'lucide-react';

export const LeftSidebarDock: React.FC = () => {
  const { isLeftSidebarOpen, toggleLeftSidebar } = useApp();
  const { t } = useLanguage();

  if (isLeftSidebarOpen) return null;

  return (
    <div className="w-12 flex-shrink-0 h-full border-r app-border apple-glass-surface flex flex-col items-center justify-start py-4 px-1.5 z-20 transition-all select-none">
      <button
        onClick={toggleLeftSidebar}
        className="w-full py-3 px-1 rounded-2xl apple-glass-pill hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 active:scale-95 flex flex-col items-center gap-3 group cursor-pointer relative"
        title={t('sidebar.expandLeft')}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-sky-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25 transition-all duration-300">
          <PanelLeftOpen className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="flex flex-col items-center gap-2 py-1 max-h-[120px] overflow-hidden">
          <span className="text-[10px] font-bold tracking-[0.22em] [writing-mode:vertical-rl] uppercase text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors truncate">
            {t('sidebar.dockCalendar')}
          </span>
        </div>

        {/* Floating Tooltip */}
        <div className="absolute left-full ml-3.5 top-2 px-3 py-1.5 rounded-xl apple-glass-modal shadow-xl text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 z-50 flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
          <span className="app-text-primary">{t('sidebar.dockCalendarTooltip')}</span>
        </div>
      </button>
    </div>
  );
};

