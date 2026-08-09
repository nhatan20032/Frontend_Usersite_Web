import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../task/TaskItem';
import { CheckSquare, Plus, PanelRightClose } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { currentRole } = useAuth();
  const {
    tasksData,
    eventsData,
    searchQuery,
    isRightSidebarOpen,
    toggleRightSidebar,
    addTask,
    deleteTask,
    toggleTask,
    toggleSubtask,
    openModal,
  } = useApp();

  const [quickInput, setQuickInput] = useState<string>('');

  const routineCount = eventsData.filter((e) => e.type === 'routine').length;
  const routinePercentage = currentRole === 'FREE' ? Math.min(100, (routineCount / 5) * 100) : 100;

  const filteredTasks = tasksData.filter(
    (t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask(quickInput.trim());
    setQuickInput('');
  };

  return (
    <aside
      id="rightSidebar"
      className={`w-80 border-l app-border apple-glass-surface p-4 space-y-5 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition ${
        !isRightSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* Tasks Header & Collapse Button */}
      <div className="flex items-center justify-between border-b app-border pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <div>
            <h3 className="font-bold text-sm app-text-primary">Công việc & Deadline</h3>
            <p className="text-[10px] app-text-muted">Quản lý Sub-tasks & Nhắc nhở</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openModal('create')}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl app-text-secondary cursor-pointer"
            title="Thêm công việc"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRightSidebar}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl app-text-secondary cursor-pointer"
            title="Thu gọn cột công việc"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add Task (Apple Form) */}
      <form onSubmit={handleQuickSubmit} className="flex gap-1.5 text-xs flex-shrink-0">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Thêm nhanh việc cần làm..."
          className="flex-1 apple-input px-3.5 py-2 placeholder-slate-400 dark:placeholder-slate-500 font-sans"
        />
        <button
          type="submit"
          className="apple-btn-primary font-bold px-3.5 py-2 rounded-2xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          Thêm
        </button>
      </form>

      {/* Routine Limit Status */}
      <div className="apple-glass-pill p-3.5 rounded-2xl text-xs space-y-1.5 flex-shrink-0">
        <div className="flex justify-between font-bold app-text-primary">
          <span>Thói quen kích hoạt:</span>
          <span className="text-blue-600 dark:text-sky-400 font-bold">
            {currentRole === 'FREE' ? `${routineCount} / 5 (FREE)` : `${routineCount} (Không giới hạn)`}
          </span>
        </div>
        <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-sky-500 h-full rounded-full transition-all"
            style={{ width: `${routinePercentage}%` }}
          />
        </div>
        <p className="text-[10px] app-text-muted">
          {currentRole === 'FREE'
            ? 'Gói FREE giới hạn tối đa 5 thói quen lặp lại.'
            : 'Đặc quyền VIP: Không giới hạn số lượng thói quen.'}
        </p>
      </div>

      {/* Dynamic Task List */}
      <div className="space-y-3 flex-1">
        {filteredTasks.length === 0 ? (
          <div className="apple-glass-card p-6 text-center rounded-3xl space-y-1">
            <p className="text-xs app-text-secondary font-medium">Không có công việc nào.</p>
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
    </aside>
  );
};
