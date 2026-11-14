import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function ProductivityKPI() {
  const { tasksData, eventsData } = useApp();
  const { language } = useLanguage();
  const completed = tasksData.filter(task => task.completed).length;
  const routines = eventsData.filter(event => event.type === 'routine').length;
  return <div className="border-t border-[var(--border-grid)] bg-[#161718] px-4 py-2 text-xs text-[var(--text-secondary)]">
    {language === 'vi' ? `Dữ liệu đã tải: ${completed}/${tasksData.length} công việc hoàn thành · ${routines} thói quen` : `Loaded data: ${completed}/${tasksData.length} tasks completed · ${routines} routines`}
  </div>;
}
