import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MiniCalendarPicker } from '../ui/MiniCalendarPicker';
import {
  CalendarDays,
  PanelLeftClose,
  PlusCircle,
  Flame,
  MapPin,
  CheckCircle2,
  Palette,
  ChevronRight,
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { currentRole } = useAuth();
  const { isLeftSidebarOpen, toggleLeftSidebar, categoryFilters, setCategoryFilters, openModal } = useApp();
  const { t } = useLanguage();

  return (
    <aside
      id="leftSidebar"
      className={`w-64 border-r app-border apple-glass-surface p-4 space-y-4 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition ${
        !isLeftSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* Left Sidebar Header & In-place Collapse Button */}
      <div className="flex items-center justify-between border-b app-border pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <div>
            <h3 className="font-bold text-sm app-text-primary">{t('sidebar.leftTitle')}</h3>
            <p className="text-[10px] app-text-muted">{t('sidebar.leftSubtitle')}</p>
          </div>
        </div>
        <button
          onClick={toggleLeftSidebar}
          className="p-1.5 hover:bg-blue-500/10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-all cursor-pointer"
          title={t('sidebar.collapseLeft')}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Create Action Button */}
      <button
        onClick={() => openModal('create')}
        className="w-full apple-btn-primary font-bold py-2.5 px-4 rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-xs flex-shrink-0 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>{t('sidebar.addSchedule')}</span>
      </button>

      {/* Mini Calendar Picker */}
      <MiniCalendarPicker />

      {/* Categories & Filters */}
      <div className="space-y-2.5 text-xs flex-1">
        <span className="font-bold app-text-muted uppercase text-[10px] tracking-wider">
          {t('sidebar.displayCategories')}
        </span>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/5 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.routine}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, routine: e.target.checked }))}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('sidebar.routineCategory')}</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/5 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.event}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, event: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('sidebar.eventCategory')}</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-500/5 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.task}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, task: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('sidebar.taskCategory')}</span>
            </span>
          </label>
        </div>

        {/* Shortcut to Settings Theme Store */}
        <div className="pt-4 border-t app-border">
          <button
            onClick={() => openModal('settings')}
            className="w-full apple-glass-pill hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 app-text-primary p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>{t('modals.settings.tabAppearance')}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 app-text-muted" />
          </button>
        </div>
      </div>

      {/* Sync Status Indicator */}
      <div className="pt-2 border-t app-border text-[11px] app-text-muted flex items-center justify-between flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('modals.settings.tabDevices')}
        </span>
        <span className="font-medium">
          {currentRole === 'FREE' ? (t('common.free')) : (t('common.vip'))}
        </span>
      </div>
    </aside>
  );
};
