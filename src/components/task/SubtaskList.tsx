import React from 'react';
import type { SubTask } from '../../types';
import { X } from 'lucide-react';

interface SubtaskListProps {
  taskId: number;
  subtasks: SubTask[];
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
  onDeleteSubtask?: (taskId: number, subtaskId: number) => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  taskId,
  subtasks,
  onToggleSubtask,
  onDeleteSubtask,
}) => {
  if (subtasks.length === 0) return null;

  return (
    <div className="space-y-1 pt-1">
      {subtasks.map((st) => (
        <div
          key={st.id}
          className="group flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-[var(--surface-container-high)]/50 transition-colors"
        >
          <label className="flex items-center gap-2 cursor-pointer text-[11px] flex-1 min-w-0">
            <input
              type="checkbox"
              checked={st.completed}
              onChange={() => onToggleSubtask(taskId, st.id)}
              className="w-4 h-4 rounded bg-[var(--surface-container-high)] border-[var(--border-subtle)] text-[var(--google-blue-primary)] focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-container)] accent-[var(--google-blue-primary)] cursor-pointer shrink-0"
            />
            <span
              className={`truncate ${
                st.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
              }`}
              title={st.title}
            >
              {st.title}
            </span>
          </label>

          {onDeleteSubtask && (
            <button
              type="button"
              onClick={() => onDeleteSubtask(taskId, st.id)}
              className="opacity-50 hover:opacity-100 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[#F28B82] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] transition-all cursor-pointer shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center"
              title="Xóa việc con"
              aria-label="Xóa việc con"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
