import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
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
            <h3 className="font-bold text-sm app-text-primary">Lịch & Danh mục</h3>
            <p className="text-[10px] app-text-muted">Bộ lọc & Điều hướng nhanh</p>
          </div>
        </div>
        <button
          onClick={toggleLeftSidebar}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl app-text-secondary transition-all cursor-pointer"
          title="Thu gọn sidebar trái"
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
        <span>Thêm lịch trình mới</span>
      </button>

      {/* Mini Calendar Picker */}
      <MiniCalendarPicker />

      {/* Categories & Filters */}
      <div className="space-y-2.5 text-xs flex-1">
        <span className="font-bold app-text-muted uppercase text-[10px] tracking-wider">
          Danh mục hiển thị
        </span>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.routine}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, routine: e.target.checked }))}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Thói quen (Routines)</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.event}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, event: e.target.checked }))}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sự kiện & Bản đồ AI</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 app-text-primary cursor-pointer font-medium hover:text-blue-600 transition-all">
            <input
              type="checkbox"
              checked={categoryFilters.task}
              onChange={(e) => setCategoryFilters((prev) => ({ ...prev, task: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Công việc & Deadline</span>
            </span>
          </label>
        </div>

        {/* Shortcut to Settings Theme Store */}
        <div className="pt-4 border-t app-border">
          <button
            onClick={() => openModal('settings')}
            className="w-full apple-glass-pill hover:bg-black/5 dark:hover:bg-white/10 app-text-primary p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>Kho giao diện</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 app-text-muted" />
          </button>
        </div>
      </div>

      {/* Sync Status Indicator */}
      <div className="pt-2 border-t app-border text-[11px] app-text-muted flex items-center justify-between flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đồng bộ tự động
        </span>
        <span className="font-medium">
          {currentRole === 'FREE' ? '1 Thiết bị' : 'Đồng bộ vô hạn'}
        </span>
      </div>
    </aside>
  );
};
