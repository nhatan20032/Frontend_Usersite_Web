import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { TaskItem } from '../task/TaskItem';
import { CheckSquare, Plus, Sparkles, Loader2, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { NotesRoutineSidebarPanel } from '../notes-routine/NotesRoutineSidebarPanel';
import { ContactsCompanionPanel } from './ContactsCompanionPanel';
import { taskApi } from '../../api/taskApi';

export const RightSidebar: React.FC = () => {
  const {
    tasksData,
    searchQuery,
    isRightSidebarOpen,
    toggleRightSidebar,
    rightSidebarTab,
    addSubtask,
    deleteSubtask,
    deleteTask,
    toggleTask,
    toggleSubtask,
    openModal,
    addTask,
    addRoutine,
    showToast,
  } = useApp();
  const { t, language } = useLanguage();

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'high'>('all');

  // AI Task Planner State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [aiResult, setAiResult] = useState<{
    goal: string;
    message: string;
    suggestedTasks: Array<{ title: string; priority: number; subtasks: string[] }>;
    suggestedRoutine?: { title: string; time: string; subroutines: string[] };
  } | null>(null);

  const quickGoals = [
    'Ôn thi IELTS 7.0',
    'Tập gym & chạy bộ 5km',
    'Học React & TypeScript',
    'Dọn dẹp & sắp xếp nhà cửa',
  ];

  const handleGenerateAi = async (goalToUse?: string) => {
    const targetGoal = goalToUse || aiGoal;
    if (!targetGoal.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await taskApi.getAiSuggestions(targetGoal.trim());
      setAiResult(res);
      showToast('Đã tạo kế hoạch AI', 'Xem trước lộ trình bên dưới', 'info');
    } catch (err) {
      showToast('Lỗi AI Planner', err instanceof Error ? err.message : 'Không kết nối được AI', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAi = async () => {
    if (!aiResult) return;
    setIsApplying(true);
    try {
      let count = 0;
      for (const t of aiResult.suggestedTasks) {
        await addTask({
          title: t.title,
          priority: t.priority === 1 ? 'high' : 'medium',
          subtasks: t.subtasks.map((st, i) => ({ id: i + 1, title: st, completed: false })),
        });
        count++;
      }
      if (aiResult.suggestedRoutine) {
        await addRoutine({
          title: aiResult.suggestedRoutine.title,
          time: aiResult.suggestedRoutine.time || '07:00 AM',
          subroutines: aiResult.suggestedRoutine.subroutines,
        });
      }
      showToast(
        'Đã áp dụng thành công',
        `Đã thêm ${count} công việc ${aiResult.suggestedRoutine ? 'và 1 thói quen' : ''} vào danh sách!`,
        'success'
      );
      setIsAiOpen(false);
      setAiResult(null);
      setAiGoal('');
    } catch (err) {
      showToast('Không thể áp dụng toàn bộ', err instanceof Error ? err.message : 'Lỗi lưu', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const pendingTaskCount = tasksData.filter((t) => !t.completed).length;

  const filteredTasks = tasksData.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterTab === 'pending' && t.completed) return false;
    if (filterTab === 'high' && t.priority !== 'high') return false;
    return true;
  });

  return (
    <aside
      id="rightSidebar"
      className={`fixed lg:relative inset-y-0 right-0 z-30 lg:z-auto w-[360px] max-w-[85vw] border-l border-[var(--border-grid)] bg-[var(--surface-container)] p-3.5 flex-shrink-0 flex flex-col overflow-hidden sidebar-transition select-none transition-colors duration-200 shadow-2xl lg:shadow-none ${!isRightSidebarOpen ? 'sidebar-collapsed' : ''
        }`}
    >
      {rightSidebarTab === 'notes-routine' ? (
        <NotesRoutineSidebarPanel
          onClose={toggleRightSidebar}
          onOpenCreateModal={() => openModal('create')}
        />
      ) : rightSidebarTab === 'contacts' ? (
        <ContactsCompanionPanel onClose={toggleRightSidebar} />
      ) : (
        <div className="w-full h-full flex flex-col space-y-3.5 overflow-y-auto">

          {/* 1. Google Tasks Companion Panel Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Blue Google Tasks style icon */}
              <div className="w-6 h-6 rounded-full bg-[var(--google-blue-primary)] flex items-center justify-center text-white shadow-xs">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('sidebar.rightTitle') || 'Google Tasks'}</h3>
                <p className="text-[11px] text-[var(--text-muted)]">{t('sidebar.rightSubtitle') || 'Công việc & Deadline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsAiOpen((prev) => !prev);
                  if (!isAiOpen) setAiResult(null);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  isAiOpen
                    ? 'bg-[var(--google-blue-primary)] text-white border-[var(--google-blue)]'
                    : 'bg-gradient-to-r from-[var(--google-blue-primary)]/15 to-purple-500/15 text-[var(--google-blue)] border-[var(--google-blue)]/30 hover:border-[var(--google-blue)]'
                }`}
                title="Trợ lý AI Lập kế hoạch (Google Gemini Free)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Planner</span>
              </button>

              <button
                onClick={() => openModal('create')}
                className="p-1.5 hover:bg-[var(--surface-container-high)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title={t('sidebar.addTaskTooltip') || 'Thêm công việc'}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Task Planner Drawer / Card */}
          {isAiOpen && (
            <div className="p-3 bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-xl space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between font-semibold text-xs text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5 text-[var(--google-blue)]">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Trợ lý AI Gemini Lập kế hoạch</span>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAi()}
                  placeholder={language === 'vi' ? 'Nhập mục tiêu (VD: Luyện thi IELTS 7.0)...' : 'Enter your goal...'}
                  className="w-full bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--google-blue)]"
                  disabled={isAiLoading || isApplying}
                />

                {/* Gợi ý nhanh */}
                {!aiResult && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {quickGoals.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setAiGoal(g);
                          handleGenerateAi(g);
                        }}
                        disabled={isAiLoading}
                        className="text-[10px] bg-[var(--surface-container)] hover:bg-[#2A2B2D] border border-[var(--border-grid)] px-2 py-0.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!aiResult && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleGenerateAi()}
                    disabled={isAiLoading || !aiGoal.trim()}
                    className="px-3 py-1.5 bg-[var(--google-blue)] hover:bg-[#A8C7FA] text-[var(--surface-canvas)] font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang phân tích...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tạo kế hoạch AI</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Hiển thị kết quả AI */}
              {aiResult && (
                <div className="space-y-2 pt-2 border-t border-[var(--border-grid)] animate-in fade-in duration-150">
                  <div className="p-2 bg-[var(--surface-container)] rounded-lg border border-[var(--border-grid)] text-[11px] text-[var(--text-secondary)]">
                    <p className="italic">{aiResult.message}</p>
                  </div>

                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="text-[11px] font-semibold text-[var(--text-primary)] flex items-center justify-between">
                      <span>Nhiệm vụ đề xuất ({aiResult.suggestedTasks.length}):</span>
                      {aiResult.suggestedRoutine && (
                        <span className="text-[#81C995] text-[10px]">+ 1 Thói quen</span>
                      )}
                    </div>
                    {aiResult.suggestedTasks.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 bg-[var(--surface-container)] border border-[var(--border-grid)] rounded-md space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[var(--text-primary)] truncate max-w-[200px]">{t.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${t.priority === 1 ? 'bg-[#D93025]/20 text-[#F28B82]' : 'bg-[#E37400]/20 text-[#FDD663]'}`}>
                            {t.priority === 1 ? 'Gấp' : 'Trung bình'}
                          </span>
                        </div>
                        {t.subtasks && t.subtasks.length > 0 && (
                          <div className="pl-2 border-l border-[var(--border-grid)] space-y-0.5 text-[10px] text-[var(--text-muted)]">
                            {t.subtasks.map((st, sIdx) => (
                              <div key={sIdx} className="truncate">• {st}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-grid)]">
                    <button
                      onClick={() => setAiResult(null)}
                      disabled={isApplying}
                      className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      Tạo lại
                    </button>
                    <button
                      onClick={handleApplyAi}
                      disabled={isApplying}
                      className="px-3 py-1.5 bg-[#1E8E3E] hover:bg-[#1B7E37] text-white font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs text-xs"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Áp dụng vào Tasks</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* 3. Filter Tabs */}
          <div className="flex items-center gap-1 text-xs border-b border-[var(--border-grid)] pb-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${filterTab === 'all'
                ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {language === 'vi' ? 'Tất cả' : 'All'} ({tasksData.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${filterTab === 'pending'
                ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {language === 'vi' ? 'Chưa xong' : 'Pending'} ({pendingTaskCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('high')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${filterTab === 'high'
                ? 'bg-[var(--surface-container-high)] text-[#F28B82]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {language === 'vi' ? 'Gấp' : 'Urgent'}
            </button>
          </div>

          {/* 4. Progress Summary */}
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-1 flex-shrink-0">
            <span>{language === 'vi' ? 'Tiến độ hoàn thành:' : 'Completion:'}</span>
            <span className="font-mono text-[#81C995] font-semibold">
              {tasksData.length - pendingTaskCount} / {tasksData.length}
            </span>
          </div>

          {/* 5. Dynamic Task List */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] p-5 text-center rounded-lg space-y-1">
                <p className="text-xs text-[var(--text-muted)] font-normal">{t('sidebar.emptyTasks')}</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleTask={toggleTask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteTask={deleteTask}
                  onEditTask={(id) => openModal('edit', { id, type: 'task' })}
                  onAddSubtask={addSubtask}
                  onDeleteSubtask={deleteSubtask}
                />
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
