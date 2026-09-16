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
          className="group flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-[#28292A]/50 transition-colors"
        >
          <label className="flex items-center gap-2 cursor-pointer text-[11px] flex-1 min-w-0">
            <input
              type="checkbox"
              checked={st.completed}
              onChange={() => onToggleSubtask(taskId, st.id)}
              className="w-3.5 h-3.5 rounded bg-[#28292A] border-[#3A3B3D] text-[#1A73E8] focus:ring-0 focus:ring-offset-0 accent-[#1A73E8] cursor-pointer shrink-0"
            />
            <span
              className={`truncate ${
                st.completed ? 'line-through text-[#70757A]' : 'text-[#D0D2D5]'
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
              className="opacity-0 group-hover:opacity-100 text-[#70757A] hover:text-[#F28B82] p-0.5 rounded transition-opacity cursor-pointer shrink-0"
              title="Xóa việc con"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
