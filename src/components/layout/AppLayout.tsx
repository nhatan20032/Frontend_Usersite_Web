import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlashSaleBanner } from './FlashSaleBanner';
import { TopHeader } from './TopHeader';
import { LeftSidebarDock } from '../sidebar/LeftSidebarDock';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { RightSidebar } from '../sidebar/RightSidebar';
import { RightSidebarDock } from '../sidebar/RightSidebarDock';
import { CalendarControls } from '../calendar/CalendarControls';
import { MonthGridView } from '../calendar/MonthGridView';
import { WeekTimelineView } from '../calendar/WeekTimelineView';
import { AgendaListView } from '../calendar/AgendaListView';
import { ProductivityKPI } from '../calendar/ProductivityKPI';
import { ModalManager } from '../modals/ModalManager';
import { ToastContainer } from '../ui/ToastContainer';

export const AppLayout: React.FC = () => {
  const { calendarView } = useApp();

  return (
    <div className="min-h-screen h-screen font-sans antialiased flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white relative">
      {/* Ambient Iridescent Meshes */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* 1. TOP FLASH SALE FROSTED RIBBON */}
      <FlashSaleBanner />

      {/* 2. TOP APP BAR (APPLE LIQUID HEADER) */}
      <TopHeader />

      {/* 3. MAIN WORKSPACE (3-COLUMN LIQUID LAYOUT) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar In-Place Expand Dock */}
        <LeftSidebarDock />

        {/* COLUMN A: LEFT SIDEBAR */}
        <LeftSidebar />

        {/* COLUMN B: CENTER MAIN CANVAS */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Calendar Header Controls */}
          <CalendarControls />

          {/* Main Scrollable Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {calendarView === 'month' && <MonthGridView />}
            {calendarView === 'week' && <WeekTimelineView />}
            {(calendarView === 'month' || calendarView === 'agenda') && <AgendaListView />}
            <ProductivityKPI />
          </div>
        </main>

        {/* COLUMN C: RIGHT SIDEBAR */}
        <RightSidebar />

        {/* Right Sidebar In-Place Expand Dock */}
        <RightSidebarDock />
      </div>

      {/* 4. MODALS & POPUPS */}
      <ModalManager />

      {/* 5. TOAST NOTIFICATIONS */}
      <ToastContainer />
    </div>
  );
};
