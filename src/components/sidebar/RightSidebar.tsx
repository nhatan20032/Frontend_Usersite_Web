import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { TaskItem } from '../task/TaskItem';
import { CheckSquare, Plus, PanelRightClose, Users } from 'lucide-react';
import { NotesRoutineSidebarPanel } from '../notes-routine/NotesRoutineSidebarPanel';

export const RightSidebar: React.FC = () => {
  const {
    tasksData,
    searchQuery,
    isRightSidebarOpen,
    toggleRightSidebar,
    rightSidebarTab,
    addTask,
    deleteTask,
    toggleTask,
    toggleSubtask,
    openModal,
  } = useApp();
  const { t, language } = useLanguage();

  const [quickInput, setQuickInput] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'high'>('all');

  const pendingTaskCount = tasksData.filter((t) => !t.completed).length;

  const filteredTasks = tasksData.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterTab === 'pending' && t.completed) return false;
    if (filterTab === 'high' && t.priority !== 'high') return false;
    return true;
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask(quickInput.trim());
    setQuickInput('');
  };

  return (
    <aside
      id="rightSidebar"
      className={`w-[360px] border-l border-[#2A2B2D] bg-[#121314] p-3.5 flex-shrink-0 flex flex-col overflow-hidden sidebar-transition select-none ${
        !isRightSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {rightSidebarTab === 'notes-routine' ? (
        <NotesRoutineSidebarPanel
          onClose={toggleRightSidebar}
          onOpenCreateModal={() => openModal('create')}
        />
      ) : rightSidebarTab === 'contacts' ? (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#81C995]/20 text-[#81C995] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#E3E2E3]">Danh bạ & Nhóm</h3>
                <p className="text-[10px] text-[#70757A]">Liên hệ & Thành viên</p>
              </div>
            </div>
            <button
              onClick={toggleRightSidebar}
              className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#E3E2E3]"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <p className="text-xs text-[#70757A]">Tính năng đồng bộ danh bạ Google Contacts đang chuẩn bị kết nối.</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col space-y-3.5 overflow-y-auto">

      {/* 1. Google Tasks Companion Panel Header */}
      <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Blue Google Tasks style icon */}
          <div className="w-6 h-6 rounded-full bg-[#1A73E8] flex items-center justify-center text-white shadow-xs">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#E3E2E3]">{t('sidebar.rightTitle') || 'Google Tasks'}</h3>
            <p className="text-[10px] text-[#70757A]">{t('sidebar.rightSubtitle') || 'Công việc & Deadline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openModal('create')}
            className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] transition-colors cursor-pointer"
            title={t('sidebar.addTaskTooltip') || 'Thêm công việc'}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRightSidebar}
            className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] transition-colors cursor-pointer"
            title={t('sidebar.collapseRight') || 'Đóng bảng'}
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Add Task Form */}
      <form onSubmit={handleQuickSubmit} className="flex gap-1.5 text-xs flex-shrink-0">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder={t('sidebar.quickTaskPlaceholder') || '+ Thêm một việc cần làm'}
          className="flex-1 min-w-0 bg-[#1F2021] border border-[#333538] focus:border-[#8AB4F8] text-[#E3E2E3] px-3 py-2 rounded-md placeholder-[#70757A] text-xs font-sans transition-all focus:outline-none focus:bg-[#28292A]"
        />
        <button
          type="submit"
          className="bg-[#1A73E8] hover:bg-[#1B66CA] text-white font-medium px-3.5 py-2 rounded-md transition-colors min-w-[60px] text-center flex-shrink-0 cursor-pointer text-xs"
        >
          {t('common.createNew') || 'Thêm'}
        </button>
      </form>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1 text-xs border-b border-[#2A2B2D] pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
            filterTab === 'all'
              ? 'bg-[#28292A] text-[#8AB4F8]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Tất cả' : 'All'} ({tasksData.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('pending')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
            filterTab === 'pending'
              ? 'bg-[#28292A] text-[#8AB4F8]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Chưa xong' : 'Pending'} ({pendingTaskCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('high')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
            filterTab === 'high'
              ? 'bg-[#28292A] text-[#F28B82]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Gấp' : 'Urgent'}
        </button>
      </div>

      {/* 4. Progress Summary */}
      <div className="flex items-center justify-between text-[11px] text-[#9AA0A6] px-1 flex-shrink-0">
        <span>{language === 'vi' ? 'Tiến độ hoàn thành:' : 'Completion:'}</span>
        <span className="font-mono text-[#81C995] font-semibold">
          {tasksData.length - pendingTaskCount} / {tasksData.length}
        </span>
      </div>

      {/* 5. Dynamic Task List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#1F2021] border border-[#2A2B2D] p-5 text-center rounded-lg space-y-1">
            <p className="text-xs text-[#70757A] font-normal">{t('sidebar.emptyTasks')}</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={toggleTask}
              onToggleSubtask={toggleSubtask}
              onDeleteTask={deleteTask}
            />
          ))
        )}
      </div>
        </div>
      )}
    </aside>
  );
};
