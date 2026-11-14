import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PanelLeftOpen } from 'lucide-react';

export const LeftSidebarDock: React.FC = () => {
  const { isLeftSidebarOpen, toggleLeftSidebar } = useApp();
  const { t } = useLanguage();

  if (isLeftSidebarOpen) return null;

  return (
    <div className="w-12 flex-shrink-0 h-full border-r border-[var(--border-grid)] bg-[var(--surface-canvas)] flex flex-col items-center justify-start py-3 px-1 z-20 select-none">
      <button
        onClick={toggleLeftSidebar}
        className="w-10 h-10 rounded-full hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
        title={t('sidebar.expandLeft') || 'Mở rộng'}
      >
        <PanelLeftOpen className="w-5 h-5" />
      </button>
    </div>
  );
};

