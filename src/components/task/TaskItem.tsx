import React from 'react';
import type { TaskItem as TaskItemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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
  const { language, t } = useLanguage();
  const subtaskCount = task.subtasks?.length || 0;
  const subtaskDone = task.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = subtaskCount > 0 ? Math.round((subtaskDone / subtaskCount) * 100) : 0;

  return (
    <div className="bg-[#1F2021] hover:bg-[#232426] border border-[#2A2B2D] hover:border-[#333538] p-3 rounded-lg space-y-2 transition-colors">
      <div className="flex items-start gap-2.5">
        {/* Round Task Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="w-4 h-4 rounded-full text-[#1A73E8] bg-[#28292A] border-[#3A3B3D] focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer accent-[#1A73E8]"
        />

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-medium text-xs text-[#E3E2E3] truncate ${
                task.completed ? 'line-through text-[#70757A]' : ''
              }`}
              title={task.title}
            >
              {task.title}
            </h4>
            {task.priority === 'high' && (
              <span className="text-[9px] bg-[#EA4335]/15 text-[#F28B82] border border-[#EA4335]/35 font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                {language === 'vi' ? 'GẤP' : 'URGENT'}
              </span>
            )}
            {task.priority === 'medium' && (
              <span className="text-[9px] bg-[#FBBC04]/15 text-[#FDD663] border border-[#FBBC04]/35 font-medium px-1.5 py-0.5 rounded flex-shrink-0">
                {language === 'vi' ? 'TB' : 'MED'}
              </span>
            )}
          </div>

          <div className="text-[10px] text-[#F28B82] font-medium flex items-center gap-1 font-mono flex-shrink-0">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{task.dueDate}</span>
          </div>

          {subtaskCount > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-[#9AA0A6]">
                <span>{language === 'vi' ? 'Tiến độ:' : 'Progress:'}</span>
                <span className="font-semibold text-[#8AB4F8] font-mono">
                  {subtaskDone}/${subtaskCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#28292A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1A73E8] h-full rounded-full transition-all"
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

          <div className="text-[10px] text-[#70757A] pt-1 border-t border-[#2A2B2D] flex items-center gap-1">
            <Bell className="w-3 h-3 text-[#8AB4F8]" />
            <span>{task.reminders || 'Push App'}</span>
          </div>
        </div>

        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-[#70757A] hover:text-[#F28B82] p-1 rounded-full hover:bg-[#28292A] cursor-pointer transition-colors"
          title={t('common.delete')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
