import React from 'react';
import type { SubTask } from '../../types';

interface SubtaskListProps {
  taskId: number;
  subtasks: SubTask[];
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({ taskId, subtasks, onToggleSubtask }) => {
  if (subtasks.length === 0) return null;

  return (
    <div className="space-y-1 pt-1">
      {subtasks.map((st) => (
        <label key={st.id} className="flex items-center gap-2 cursor-pointer text-[11px] app-text-secondary">
          <input
            type="checkbox"
            checked={st.completed}
            onChange={() => onToggleSubtask(taskId, st.id)}
            className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}>
            {st.title}
          </span>
        </label>
      ))}
    </div>
  );
};
