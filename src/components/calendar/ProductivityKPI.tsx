import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export function ProductivityKPI() {
  const { tasksData, eventsData } = useApp();
  const { language } = useLanguage();
  const completed = tasksData.filter((task) => task.completed).length;
  const routines = eventsData.filter((event) => event.type === 'routine').length;

  return (
    <div className="border-t border-[var(--border-grid)] bg-[var(--surface-container-low)] px-4 py-2 text-xs text-[var(--text-secondary)] flex items-center justify-between select-none transition-colors">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#81C995] shrink-0" />
        <span>
          {language === 'vi'
            ? `Dữ liệu đã tải: ${completed}/${tasksData.length} công việc hoàn thành · ${routines} thói quen`
            : `Loaded data: ${completed}/${tasksData.length} tasks completed · ${routines} routines`}
        </span>
      </div>
      <div className="text-[11px] text-[var(--text-muted)] font-mono hidden md:inline">
        RoutinePulse Studio
      </div>
    </div>
  );
}
