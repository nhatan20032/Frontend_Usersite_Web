import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from './TopHeader';
import { LeftSidebarDock } from '../sidebar/LeftSidebarDock';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { RightSidebar } from '../sidebar/RightSidebar';
import { RightSidebarDock } from '../sidebar/RightSidebarDock';
import { MonthGridView } from '../calendar/MonthGridView';
import { WeekTimelineView } from '../calendar/WeekTimelineView';
import { AgendaListView } from '../calendar/AgendaListView';
import { DayInspectorDrawer } from '../calendar/DayInspectorDrawer';
import { ProductivityKPI } from '../calendar/ProductivityKPI';
import { ModalManager } from '../modals/ModalManager';
import { ToastContainer } from '../ui/ToastContainer';

export const AppLayout: React.FC = () => {
  const { calendarView, isLeftSidebarOpen, toggleLeftSidebar, isRightSidebarOpen, toggleRightSidebar } = useApp();

  return (
    <div className="min-h-screen h-screen font-sans antialiased flex flex-col overflow-hidden bg-[var(--surface-canvas)] text-[var(--text-primary)] selection:bg-[var(--google-blue-primary)] selection:text-white relative transition-colors duration-200">
      {/* 1. TOP APP BAR (GOOGLE CALENDAR DARK HEADER) */}
      <TopHeader />

      {/* 2. MAIN WORKSPACE (3-COLUMN LIQUID LAYOUT) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar Mobile Backdrop */}
        {isLeftSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-25 md:hidden animate-in fade-in duration-150 backdrop-blur-xs"
            onClick={toggleLeftSidebar}
          />
        )}

        {/* Left Sidebar In-Place Expand Dock */}
        <LeftSidebarDock />

        {/* COLUMN A: LEFT SIDEBAR */}
        <LeftSidebar />

        {/* COLUMN B: CENTER MAIN CANVAS (FULL-HEIGHT LIQUID LAYOUT) */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[var(--surface-canvas)] transition-colors duration-200">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {calendarView === 'month' && <MonthGridView />}
            {calendarView === 'week' && <WeekTimelineView />}
            {calendarView === 'agenda' && <AgendaListView />}
          </div>
          <ProductivityKPI />
        </main>

        {/* Right Sidebar Tablet/Mobile Backdrop */}
        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-25 lg:hidden animate-in fade-in duration-150 backdrop-blur-xs"
            onClick={toggleRightSidebar}
          />
        )}

        {/* COLUMN C: RIGHT SIDEBAR */}
        <RightSidebar />

        {/* Right Sidebar In-Place Expand Dock */}
        <RightSidebarDock />
      </div>

      {/* 4. SLIDE-OVER DAY INSPECTOR DRAWER */}
      <DayInspectorDrawer />

      {/* 5. MODALS & POPUPS */}
      <ModalManager />

      {/* 6. TOAST NOTIFICATIONS */}
      <ToastContainer />
    </div>
  );
};
