import React from 'react';
import type { TaskItem as TaskItemType } from '../../types';
import { SubtaskList } from './SubtaskList';
import { Clock, Bell, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: TaskItemType;
  onToggleTask: (id: number) => void;
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
}) => {
  const subtaskCount = task.subtasks?.length || 0;
  const subtaskDone = task.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = subtaskCount > 0 ? Math.round((subtaskDone / subtaskCount) * 100) : 0;

  return (
    <div className="apple-glass-card p-4 rounded-3xl space-y-2.5">
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="w-4 h-4 rounded text-blue-600 mt-0.5 cursor-pointer"
        />

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <h4
              className={`font-bold text-xs app-text-primary ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>
            {task.priority === 'high' && (
              <span className="text-[9px] bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-400/30 font-bold px-2 py-0.5 rounded-full">
                GẤP
              </span>
            )}
            {task.priority === 'medium' && (
              <span className="text-[9px] bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 font-bold px-2 py-0.5 rounded-full">
                TB
              </span>
            )}
          </div>

          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>

          {subtaskCount > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] app-text-muted">
                <span>Tiến độ:</span>
                <span className="font-bold text-blue-600 dark:text-sky-400">
                  {subtaskDone}/${subtaskCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <SubtaskList
                taskId={task.id}
                subtasks={task.subtasks}
                onToggleSubtask={onToggleSubtask}
              />
            </div>
          )}

          <div className="text-[10px] app-text-muted pt-1 border-t app-border flex items-center gap-1">
            <Bell className="w-3 h-3 text-blue-600 dark:text-sky-400" />
            <span>{task.reminders || 'Push App'}</span>
          </div>
        </div>

        <button
          onClick={() => onDeleteTask(task.id)}
          className="app-text-muted hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          title="Xóa task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
