import React, { useState } from 'react';
import type { TaskItem as TaskItemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SubtaskList } from './SubtaskList';
import { Clock, Bell, Trash2, Plus, Pencil } from 'lucide-react';

interface TaskItemProps {
  task: TaskItemType;
  onToggleTask: (id: number) => void;
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask?: (id: number) => void;
  onAddSubtask?: (taskId: number, title: string) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
  onEditTask,
  onAddSubtask,
  onDeleteSubtask,
}) => {
  const { language, t } = useLanguage();
  const [isAddingSubtask, setIsAddingSubtask] = useState<boolean>(false);
  const [quickSubtaskText, setQuickSubtaskText] = useState<string>('');

  const subtaskCount = task.subtasks?.length || 0;
  const subtaskDone = task.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = subtaskCount > 0 ? Math.round((subtaskDone / subtaskCount) * 100) : 0;

  return (
    <div className="bg-[var(--surface-container)] hover:bg-[#232426] border border-[var(--border-grid)] hover:border-[var(--border-subtle)] p-3 rounded-lg space-y-2 transition-colors group relative">
      <div className="flex items-start gap-2.5">
        {/* Round Task Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="w-4 h-4 rounded-full text-[var(--google-blue-primary)] bg-[var(--surface-container-high)] border-[var(--border-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-container)] mt-0.5 cursor-pointer accent-[var(--google-blue-primary)] shrink-0"
        />

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 min-h-[24px]">
            <h4
              className={`font-medium text-xs text-[var(--text-primary)] truncate min-w-0 flex-1 ${
                task.completed ? 'line-through text-[var(--text-muted)]' : ''
              }`}
              title={task.title}
            >
              {task.title}
            </h4>

            <div className="flex items-center gap-1 shrink-0">
              {task.priority === 'high' && (
                <span className="text-[11px] bg-[var(--google-rose)]/15 text-[var(--google-rose)] font-bold px-1.5 py-0.5 rounded border border-[var(--google-rose)]/30">
                  {language === 'vi' ? 'GẤP' : 'URGENT'}
                </span>
              )}
              {task.priority === 'medium' && (
                <span className="text-[11px] bg-[var(--google-amber)]/15 text-[var(--google-amber)] font-semibold px-1.5 py-0.5 rounded border border-[var(--google-amber)]/30">
                  {language === 'vi' ? 'TB' : 'MED'}
                </span>
              )}

              <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onEditTask?.(task.id)}
                  aria-label={t('common.edit') || 'Chỉnh sửa'}
                  className="text-[var(--text-muted)] hover:text-[var(--google-blue)] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title={t('common.edit') || 'Chỉnh sửa'}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label={t('common.delete') || 'Xóa'}
                  className="text-[var(--text-muted)] hover:text-[#F28B82] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] cursor-pointer transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title={t('common.delete') || 'Xóa'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#F28B82] font-medium flex items-center gap-1 font-mono flex-shrink-0">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{task.dueDate}</span>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-1 pt-1">
            {subtaskCount > 0 && (
              <>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>{language === 'vi' ? 'Tiến độ:' : 'Progress:'}</span>
                  <span className="font-semibold text-[var(--google-blue)] font-mono">
                    {subtaskDone}/${subtaskCount} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-container-high)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--google-blue-primary)] h-full rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <SubtaskList
                  taskId={task.id}
                  subtasks={task.subtasks}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              </>
            )}

            {/* Inline Quick-Add Subtask */}
            {onAddSubtask && (
              <div className="pt-0.5">
                {isAddingSubtask ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (quickSubtaskText.trim()) {
                        onAddSubtask(task.id, quickSubtaskText.trim());
                        setQuickSubtaskText('');
                        setIsAddingSubtask(false);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={quickSubtaskText}
                      onChange={(e) => setQuickSubtaskText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsAddingSubtask(false);
                          setQuickSubtaskText('');
                        }
                      }}
                      placeholder={language === 'vi' ? '+ Việc con... (Enter)' : '+ Subtask... (Enter)'}
                      className="flex-1 bg-[#141516] border border-[#3C4043] focus:border-[var(--google-blue)] rounded px-2 py-0.5 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2 py-0.5 rounded bg-[var(--google-blue-primary)] hover:bg-[#1557B0] text-white text-[11px] font-semibold transition cursor-pointer"
                    >
                      {language === 'vi' ? 'Lưu' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSubtask(false);
                        setQuickSubtaskText('');
                      }}
                      className="px-1 py-0.5 rounded hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] text-[11px] transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(true)}
                    className="text-[11px] text-[var(--google-blue)]/80 hover:text-[var(--google-blue)] hover:underline flex items-center gap-1 transition-colors cursor-pointer pt-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{language === 'vi' ? 'Thêm việc con' : 'Add subtask'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-grid)] flex items-center gap-1">
            <Bell className="w-3 h-3 text-[var(--google-blue)]" />
            <span>{task.reminders || 'Push App'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
