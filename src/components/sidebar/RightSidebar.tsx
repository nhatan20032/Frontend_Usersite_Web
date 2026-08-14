import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { TaskItem } from '../task/TaskItem';
import { CheckSquare, Plus, PanelRightClose, Sparkles, Lock } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { isPremium } = useAuth();
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
    triggerPremiumFeature,
    showToast,
  } = useApp();
  const { t, language } = useLanguage();

  const [quickInput, setQuickInput] = useState<string>('');

  const routineCount = eventsData.filter((e) => e.type === 'routine').length;
  const routinePercentage = !isPremium ? Math.min(100, (routineCount / 5) * 100) : 100;

  const pendingTaskCount = tasksData.filter((t) => !t.completed).length;
  const taskPercentage = !isPremium ? Math.min(100, (pendingTaskCount / 10) * 100) : 100;

  const filteredTasks = tasksData.filter(
    (t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    if (!isPremium && pendingTaskCount >= 10) {
      triggerPremiumFeature(language === 'vi' ? 'Tạo hơn 10 công việc chưa hoàn thành' : 'Create > 10 active tasks');
      return;
    }

    addTask(quickInput.trim());
    setQuickInput('');
  };

  const handleAiSuggest = () => {
    if (!isPremium) {
      triggerPremiumFeature(language === 'vi' ? 'Trợ lý AI Lập Kế Hoạch & Gợi ý nhiệm vụ' : 'AI Task Planning Assistant');
      return;
    }
    // Pro feature
    addTask('🎯 [AI] Đánh giá KPI & tiến độ tuần này', 'high');
    addTask('📚 [AI] Dành 30p nâng cao kỹ năng chuyên môn', 'medium');
    showToast('AI Task Planner', 'Đã tự động tạo 2 nhiệm vụ tối ưu hóa năng suất dựa trên AI (Đặc quyền PRO)!', 'success');
  };

  return (
    <aside
      id="rightSidebar"
      className={`w-80 border-l app-border apple-glass-surface p-4 space-y-4 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition ${
        !isRightSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* Tasks Header & Collapse Button */}
      <div className="flex items-center justify-between border-b app-border pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <div>
            <h3 className="font-bold text-sm app-text-primary">{t('sidebar.rightTitle')}</h3>
            <p className="text-[10px] app-text-muted">{t('sidebar.rightSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openModal('create')}
            className="p-1.5 hover:bg-blue-500/10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            title={t('sidebar.addTaskTooltip')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRightSidebar}
            className="p-1.5 hover:bg-blue-500/10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            title={t('sidebar.collapseRight')}
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleQuickSubmit} className="flex gap-1.5 text-xs flex-shrink-0">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder={t('sidebar.quickTaskPlaceholder')}
          className="flex-1 min-w-0 apple-input px-3.5 py-2 placeholder-slate-400 dark:placeholder-slate-500 font-sans"
        />
        <button
          type="submit"
          className="apple-btn-primary font-bold px-3 py-2 rounded-2xl transition-all shadow-md shadow-blue-500/20 min-w-[64px] text-center flex-shrink-0 cursor-pointer"
        >
          {t('common.createNew')}
        </button>
      </form>

      {/* AI Assistant Banner / Button */}
      <button
        type="button"
        onClick={handleAiSuggest}
        className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
          isPremium
            ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300 hover:border-purple-500'
            : 'apple-glass-pill hover:border-amber-500/50 text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{language === 'vi' ? 'Trợ lý AI Gợi ý Task' : 'AI Task Assistant'}</span>
        </div>
        {isPremium ? (
          <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-extrabold">
            PRO ⭐
          </span>
        ) : (
          <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> Khóa
          </span>
        )}
      </button>

      {/* Task & Routine Limit Indicators */}
      <div className="space-y-2 flex-shrink-0">
        {/* Task Counter */}
        <div className="apple-glass-pill p-3 rounded-2xl text-xs space-y-1.5 flex flex-col justify-between">
          <div className="flex justify-between items-center font-bold app-text-primary gap-2">
            <span className="truncate">{language === 'vi' ? 'Công việc cần làm:' : 'Active Tasks:'}</span>
            <span className={`font-mono text-[11px] font-extrabold ${!isPremium && pendingTaskCount >= 10 ? 'text-rose-500' : 'text-blue-600 dark:text-sky-400'}`}>
              {!isPremium ? `${pendingTaskCount} / 10 (FREE)` : `${pendingTaskCount} (PRO VIP)`}
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                !isPremium && pendingTaskCount >= 10
                  ? 'bg-rose-500'
                  : 'bg-blue-600 dark:bg-sky-500'
              }`}
              style={{ width: `${taskPercentage}%` }}
            />
          </div>
          {!isPremium && pendingTaskCount >= 8 && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
              ⚠️ Sắp chạm giới hạn 10 task. Hãy hoàn thành hoặc nâng cấp Pro!
            </p>
          )}
        </div>

        {/* Routine Limit Status */}
        <div className="apple-glass-pill p-3 rounded-2xl text-xs space-y-1.5 flex flex-col justify-between">
          <div className="flex justify-between items-center font-bold app-text-primary gap-2">
            <span className="truncate">{t('sidebar.routineCategory')}:</span>
            <span className="text-blue-600 dark:text-sky-400 font-bold font-mono text-[11px]">
              {!isPremium ? `${routineCount} / 5 (FREE)` : `${routineCount} (VIP)`}
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-sky-500 h-full rounded-full transition-all"
              style={{ width: `${routinePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Task List */}
      <div className="space-y-2.5 flex-1">
        {filteredTasks.length === 0 ? (
          <div className="apple-glass-card p-6 text-center rounded-3xl space-y-1">
            <p className="text-xs app-text-secondary font-medium">{t('sidebar.emptyTasks')}</p>
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
