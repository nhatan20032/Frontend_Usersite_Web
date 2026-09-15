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
    addTask('🎯 [AI] Đánh giá KPI & tiến độ tuần này', 'high');
    addTask('📚 [AI] Dành 30p nâng cao kỹ năng chuyên môn', 'medium');
    showToast('AI Task Planner', 'Đã tự động tạo 2 nhiệm vụ tối ưu hóa năng suất dựa trên AI (Đặc quyền PRO)!', 'success');
  };

  return (
    <aside
      id="rightSidebar"
      className={`w-80 border-l border-[#2A2B2D] bg-[#121314] p-3.5 space-y-4 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition select-none ${
        !isRightSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
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

      {/* 2. Google Quick Add Task Form */}
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

      {/* 3. AI Assistant Feature Card */}
      <button
        type="button"
        onClick={handleAiSuggest}
        className={`w-full p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
          isPremium
            ? 'bg-[#28292A] border-[#333538] hover:border-[#8AB4F8] text-[#8AB4F8]'
            : 'bg-[#1F2021] border-[#2A2B2D] hover:border-[#333538] text-[#E3E2E3]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1A73E8]/20 text-[#8AB4F8] flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs">{language === 'vi' ? 'Trợ lý AI Gợi ý Task' : 'AI Task Assistant'}</span>
        </div>
        {isPremium ? (
          <span className="text-[10px] bg-[#8AB4F8]/15 text-[#8AB4F8] px-2 py-0.5 rounded-full font-bold">
            PRO ⭐
          </span>
        ) : (
          <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> Khóa
          </span>
        )}
      </button>

      {/* 4. Task Quota & Routine Progress Indicators */}
      <div className="space-y-2 flex-shrink-0">
        {/* Task Counter */}
        <div className="bg-[#1F2021] border border-[#2A2B2D] p-2.5 rounded-lg text-xs space-y-1.5 flex flex-col justify-between">
          <div className="flex justify-between items-center font-medium text-[#E3E2E3] gap-2">
            <span className="truncate text-[11px]">{language === 'vi' ? 'Công việc cần làm:' : 'Active Tasks:'}</span>
            <span className={`font-mono text-[11px] font-bold ${!isPremium && pendingTaskCount >= 10 ? 'text-[#F28B82]' : 'text-[#8AB4F8]'}`}>
              {!isPremium ? `${pendingTaskCount} / 10 (FREE)` : `${pendingTaskCount} (PRO VIP)`}
            </span>
          </div>
          <div className="w-full bg-[#2A2B2D] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                !isPremium && pendingTaskCount >= 10
                  ? 'bg-[#F28B82]'
                  : 'bg-[#1A73E8]'
              }`}
              style={{ width: `${taskPercentage}%` }}
            />
          </div>
          {!isPremium && pendingTaskCount >= 8 && (
            <p className="text-[10px] text-[#FDD663] font-normal">
              ⚠️ Sắp chạm giới hạn 10 task. Hãy hoàn thành hoặc nâng cấp Pro!
            </p>
          )}
        </div>

        {/* Routine Limit Status */}
        <div className="bg-[#1F2021] border border-[#2A2B2D] p-2.5 rounded-lg text-xs space-y-1.5 flex flex-col justify-between">
          <div className="flex justify-between items-center font-medium text-[#E3E2E3] gap-2">
            <span className="truncate text-[11px]">{t('sidebar.routineCategory')}:</span>
            <span className="text-[#8AB4F8] font-bold font-mono text-[11px]">
              {!isPremium ? `${routineCount} / 5 (FREE)` : `${routineCount} (VIP)`}
            </span>
          </div>
          <div className="w-full bg-[#2A2B2D] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1E8E3E] h-full rounded-full transition-all"
              style={{ width: `${routinePercentage}%` }}
            />
          </div>
        </div>
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
    </aside>
  );
};
