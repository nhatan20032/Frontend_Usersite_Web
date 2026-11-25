import { usePreferences } from './PreferencesContext';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CalendarEvent,
  TaskItem,
  CreateTaskInput,
  CreateRoutineInput,
  CalendarViewMode,
  ThemeName,
  CalendarCategory,
  CategoryFilters,
  ToastNotification,
  ToastType,
  ActiveModalType,
  Priority,
  RightSidebarTab,
  KeepNote,
  NoteChecklistItem,
} from '../types';
import { useAuth } from './AuthContext';
import { getVietnamHolidays } from '../utils/vietnamHolidays';
import { eventApi } from '../api/eventApi';
import { routineApi } from '../api/routineApi';
import { taskApi } from '../api/taskApi';
import { eventFromDto, eventPayload, routineFromDto, taskFromDto, priorityNumber } from '../api/calendarMapping';
import { noteApi } from '../api/noteApi';
import { categoryApi } from '../api/categoryApi';
import { syncHubClient } from '../services/syncHubClient';

interface AppContextType {
  // Calendar & Events
  eventsData: CalendarEvent[];
  selectedDay: number;
  selectedMonth: number; // 0-indexed (0 = Jan, 11 = Dec)
  selectedYear: number;
  calendarView: CalendarViewMode;
  categories: CalendarCategory[];
  categoryFilters: CategoryFilters;
  searchQuery: string;
  activeEventId: number | null;
  activeEditItem: { id: number, type: 'task' | 'event' } | null;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  updateEvent: (id: number, updated: Partial<CalendarEvent>) => Promise<boolean>;
  deleteEvent: (id: number, deleteAllSeries?: boolean) => void;
  activeRecurringEvent: CalendarEvent | null;
  recurringActionType: 'delete' | 'edit';
  openRecurringModal: (event: CalendarEvent, action?: 'delete' | 'edit') => void;
  closeRecurringModal: () => void;
  toggleCheckInRoutine: (id: number) => void;
  addRoutine: (input: CreateRoutineInput) => Promise<boolean>;
  addSubroutine: (routineId: number, title: string) => void;
  toggleSubroutine: (routineId: number, subroutineId: number) => void;
  deleteSubroutine: (routineId: number, subroutineId: number) => void;
  setCalendarView: (view: CalendarViewMode) => void;
  selectDate: (day: number, month?: number, year?: number) => void;
  selectToday: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  setCategoryFilters: React.Dispatch<React.SetStateAction<CategoryFilters>>;
  setSearchQuery: (query: string) => void;

  // Tasks & Subtasks
  tasksData: TaskItem[];
  addTask: (input: string | CreateTaskInput, priority?: Priority) => Promise<boolean>;
  addSubtask: (taskId: number, title: string) => void;
  deleteSubtask: (taskId: number, subtaskId: number) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, updated: Partial<TaskItem>) => Promise<boolean>;
  toggleTask: (id: number) => void;
  toggleSubtask: (taskId: number, subtaskId: number) => void;

  // Layout & Sidebars
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  rightSidebarTab: RightSidebarTab;
  setRightSidebarTab: (tab: RightSidebarTab) => void;
  openRightSidebarTab: (tab: RightSidebarTab) => void;

  // Keep Notes
  notesData: KeepNote[];
  addNote: (note: Omit<KeepNote, 'id' | 'updatedAt'>) => Promise<boolean>;
  updateNote: (id: string, updated: Partial<Omit<KeepNote, 'id'>>) => Promise<boolean>;
  toggleNotePin: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleNoteChecklistItem: (noteId: string, itemId: string) => void;

  // Day Inspector
  isDayInspectorOpen: boolean;
  openDayInspector: (day?: number) => void;
  closeDayInspector: () => void;

  // Theme
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<boolean>;

  // Modals & Navigation
  activeModal: ActiveModalType;
  settingsInitialTab: string;
  openModal: (modal: ActiveModalType, param?: any) => void;
  closeModal: () => void;
  triggerPremiumFeature: (featureName: string) => void;

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const defaultCategories: CalendarCategory[] = [
  { id: 'routine', name: 'Thói quen hằng ngày', color: '#FDD663', isBuiltIn: true },
  { id: 'event', name: 'Sự kiện & Hội thảo', color: '#8AB4F8', isBuiltIn: true },
  { id: 'task', name: 'Nhiệm vụ & Deadline', color: '#81C995', isBuiltIn: true },
  { id: 'birthday', name: 'Sinh nhật cá nhân', color: '#FF7597', isBuiltIn: true },
  { id: 'holiday', name: 'Ngày lễ theo khu vực', color: '#C58AF9', isBuiltIn: true },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helpers to map between local KeepNote types and backend KeepNoteDto
const mapDtoToKeepNote = (dto: any): KeepNote => ({
  id: dto.id,
  title: dto.title,
  content: dto.content,
  isPinned: dto.isPinned,
  color: (['amber', 'blue', 'green', 'purple'].includes(dto.color) ? dto.color : 'blue') as KeepNote['color'],
  tags: dto.tags,
  checklist: dto.checklist?.map((c: any) => ({
    id: c.id,
    text: c.text,
    completed: c.isCompleted ?? c.completed ?? false,
  })),
  updatedAt: dto.updatedAt || 'Vừa xong',
});

const mapKeepNoteToDtoChecklist = (items?: NoteChecklistItem[]): any[] | undefined =>
  items?.map((c) => ({
    id: c.id,
    text: c.text,
    completed: c.completed,
  }));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRole, currentUser } = useAuth();

  // Dynamic real system date initialization
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(() => now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(() => now.getDate());

  // Dynamic Categories state
  const [categories, setCategories] = useState<CalendarCategory[]>( defaultCategories );


  // Persistent storage for Events and Tasks
  const [eventsData, setEventsData] = useState<CalendarEvent[]>( [] );
  const { preferences, save: savePreferences } = usePreferences();

  // Read-only holidays come from the backend, never saved as user events.
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    let request = 0;
    const refresh = async () => {
      const id = ++request;
      try {
        const holidays = await getVietnamHolidays(selectedYear, preferences.language);
        if (active && id === request) setEventsData(prev => [...prev.filter(e => e.categoryId !== 'holiday'), ...holidays]);
      } catch (e) {
        if (active && id === request) {
          setEventsData(prev => prev.filter(e => e.categoryId !== 'holiday'));
          if ((e as { status?: number })?.status !== 401) {
            showToast('Chưa tải được ngày lễ', e instanceof Error ? e.message : 'Lỗi kết nối', 'error');
          }
        }
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 60 * 60 * 1000);
    window.addEventListener('focus', refresh);
    window.addEventListener('holiday-region-changed', refresh);
    return () => { active = false; clearInterval(interval); window.removeEventListener('focus', refresh); window.removeEventListener('holiday-region-changed', refresh); };
  }, [selectedYear, currentUser?.id, preferences.language]);

  // Real-time Personal Birthday Event Sync onto Calendar
  useEffect(() => {
    if (!currentUser?.birthday) {
      setEventsData((prev) => prev.filter((e) => e.id !== 888888 && e.categoryId !== 'birthday'));
      return;
    }

    try {
      const [bYearStr, bMonthStr, bDayStr] = currentUser.birthday.split('-');
      if (!bMonthStr || !bDayStr) return;
      const bMonth = parseInt(bMonthStr, 10) - 1; // 0-indexed
      const bDay = parseInt(bDayStr, 10);
      const bYear = parseInt(bYearStr, 10);
      const age = selectedYear - bYear;

      const birthdayTitle = age > 0
        ? `🎂 Sinh nhật ${currentUser.name || 'bạn'} (${age} tuổi)`
        : `🎂 Sinh nhật ${currentUser.name || 'bạn'}`;

      const birthdayEvent: CalendarEvent = {
        id: 888888,
        type: 'event',
        title: birthdayTitle,
        time: 'Cả ngày',
        priority: 'high',
        year: selectedYear,
        month: bMonth,
        day: bDay,
        colorTag: '#FF7597',
        categoryId: 'birthday',
        status: 'free',
        description: `Chúc mừng sinh nhật ${currentUser.name || 'bạn'}! Chúc bạn tuổi mới nhiều sức khỏe, may mắn và hạnh phúc! 🎉🎂🎈`,
      };

      setEventsData((prev) => {
        const withoutOld = prev.filter((e) => e.id !== 888888 && e.categoryId !== 'birthday');
        return [birthdayEvent, ...withoutOld];
      });
    } catch (err) {
      console.warn('Lỗi xử lý ngày sinh nhật:', err);
    }
  }, [currentUser?.birthday, currentUser?.name, selectedYear]);

  const [tasksData, setTasksData] = useState<TaskItem[]>( [] );



  const [calendarView, setCalendarViewMode] = useState<CalendarViewMode>('month');
  const currentTheme = preferences.currentTheme;
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>(() => {
    const initial: CategoryFilters = { routine: true, event: true, task: true, holiday: true };
    categories.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('tasks');

  const [notesData, setNotesData] = useState<KeepNote[]>( [] );


  useEffect(() => {
    let active = true;
    setTasksData([]); setNotesData([]); setCategories(defaultCategories);
    setEventsData(prev => prev.filter(e => e.categoryId === 'holiday' || (currentUser && e.categoryId === 'birthday')));
    if (!currentUser) { void syncHubClient.stop(); return; }
    const load = async () => {
      try {
        const [events, routines, tasks, notes, cats] = await Promise.all([
          eventApi.getEvents(), routineApi.getRoutines(), taskApi.getTasks(), noteApi.getNotes(), categoryApi.getCategories(),
        ]);
        if (!active) return;
        setEventsData(prev => [...prev.filter(e => e.categoryId === 'holiday' || e.categoryId === 'birthday'), ...events.map(eventFromDto), ...routines.map(r => routineFromDto(r, selectedYear, selectedMonth, selectedDay))]);
        setTasksData(tasks.filter(t => !t.parentId).map(taskFromDto));
        setNotesData(notes.map(mapDtoToKeepNote));
        setCategories([...defaultCategories, ...cats.filter(c => !defaultCategories.some(d => d.id === c.id))]);
        setCategoryFilters(prev => ({ ...prev, ...Object.fromEntries(cats.map(c => [c.id, true])) }));
      } catch (e) { if (active && (e as { status?: number })?.status !== 401) showToast('Không tải được dữ liệu', e instanceof Error ? e.message : 'Lỗi kết nối', 'error'); }
    };
    void load(); void syncHubClient.start();
    const unsubData = syncHubClient.onDataChanged(() => { void load(); });
    const unsubNotif = syncHubClient.onNotificationReceived(n => showToast(n.title, n.message, 'info'));
    return () => { active = false; unsubData(); unsubNotif(); void syncHubClient.stop(); };
  }, [currentUser?.id, selectedYear, selectedMonth, selectedDay]);

  const openRightSidebarTab = (tab: RightSidebarTab) => {
    if (isRightSidebarOpen && rightSidebarTab === tab) {
      setIsRightSidebarOpen(false);
    } else {
      setRightSidebarTab(tab);
      setIsRightSidebarOpen(true);
    }
  };

  const reportError = (e: unknown) => showToast('Không thể lưu', e instanceof Error ? e.message : 'Lỗi kết nối', 'error');
  const addNote = async (note: Omit<KeepNote, 'id' | 'updatedAt'>) => {
    try {
      const saved = await noteApi.createNote({ ...note, checklist: mapKeepNoteToDtoChecklist(note.checklist) });
      if (note.isPinned) { await noteApi.togglePin(saved.id); saved.isPinned = true; }
      setNotesData(prev => [mapDtoToKeepNote(saved), ...prev.filter(n => n.id !== saved.id)]);
      showToast('Đã lưu', 'Đã tạo ghi chú', 'success'); return true;
    } catch (e) { reportError(e); return false; }
  };
  const toggleNotePin = async (id: string) => {
    try { const res = await noteApi.togglePin(id); setNotesData(prev => prev.map(n => n.id === id ? { ...n, isPinned: res.isPinned } : n)); }
    catch (e) { reportError(e); }
  };
  const deleteNote = async (id: string) => {
    try { await noteApi.deleteNote(id); setNotesData(prev => prev.filter(n => n.id !== id)); }
    catch (e) { reportError(e); }
  };
  const updateNote = async (id: string, updated: Partial<Omit<KeepNote, 'id'>>) => {
    const note = notesData.find(n => n.id === id); if (!note) return false;
    try {
      const next = { ...note, ...updated };
      const saved = await noteApi.updateNote(id, { ...next, checklist: mapKeepNoteToDtoChecklist(next.checklist) });
      setNotesData(prev => prev.map(n => n.id === id ? mapDtoToKeepNote(saved) : n)); return true;
    } catch (e) { reportError(e); return false; }
  };
  const toggleNoteChecklistItem = (noteId: string, itemId: string) => {
    const note = notesData.find(n => n.id === noteId);
    if (note) void updateNote(noteId, { checklist: note.checklist?.map(c => c.id === itemId ? { ...c, completed: !c.completed } : c) });
  };

  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [activeEditItem, setActiveEditItem] = useState<{ id: number, type: 'task' | 'event' } | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (title: string, message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const selectDate = (day: number, month?: number, year?: number) => {
    setSelectedDay(day);
    if (month !== undefined) setSelectedMonth(month);
    if (year !== undefined) setSelectedYear(year);
  };

  const selectToday = () => {
    const today = new Date();
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    showToast(
      'Hôm nay',
      `Đã chuyển đến ngày ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}.`,
      'info'
    );
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const [isDayInspectorOpen, setIsDayInspectorOpen] = useState<boolean>(false);

  const openDayInspector = (day?: number) => {
    if (day !== undefined) setSelectedDay(day);
    setIsDayInspectorOpen(true);
  };

  const closeDayInspector = () => {
    setIsDayInspectorOpen(false);
  };

  const [activeRecurringEvent, setActiveRecurringEvent] = useState<CalendarEvent | null>(null);
  const [recurringActionType, setRecurringActionType] = useState<'delete' | 'edit'>('delete');

  const openRecurringModal = (event: CalendarEvent, action: 'delete' | 'edit' = 'delete') => {
    setActiveRecurringEvent(event);
    setRecurringActionType(action);
    openModal('recurring-action');
  };

  const closeRecurringModal = () => {
    setActiveRecurringEvent(null);
    closeModal();
  };

  const addEvent = async (newEvent: Omit<CalendarEvent, 'id'>): Promise<boolean> => {
    if (newEvent.type === 'routine') return saveRoutine(newEvent);
    const year = newEvent.year || selectedYear;
    const month = newEvent.month !== undefined ? newEvent.month : selectedMonth;
    const baseDay = newEvent.day || selectedDay;
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const newEventsToAdd: CalendarEvent[] = [];
    const freq = (newEvent.frequency || '').toLowerCase();
    const generatedSeriesId = 'series_' + Date.now();

    // Recurrence Engine: Generate for matching days in month
    if (freq.includes('hàng ngày') || freq.includes('daily')) {
      for (let d = baseDay; d <= daysInCurrentMonth; d++) {
        newEventsToAdd.push({
          ...newEvent,
          id: Date.now() + d * 10,
          seriesId: generatedSeriesId,
          year,
          month,
          day: d,
        });
      }
    } else if (freq.includes('thứ 2') || freq.includes('weekday') || freq.includes('mon - fri') || freq.includes('tuần (thứ 2')) {
      for (let d = 1; d <= daysInCurrentMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Mon to Fri
          newEventsToAdd.push({
            ...newEvent,
            id: Date.now() + d * 10,
            seriesId: generatedSeriesId,
            year,
            month,
            day: d,
          });
        }
      }
    } else if (freq.includes('hàng tuần') || freq.includes('weekly')) {
      const targetDayOfWeek = new Date(year, month, baseDay).getDay();
      for (let d = 1; d <= daysInCurrentMonth; d++) {
        if (new Date(year, month, d).getDay() === targetDayOfWeek) {
          newEventsToAdd.push({
            ...newEvent,
            id: Date.now() + d * 10,
            seriesId: generatedSeriesId,
            year,
            month,
            day: d,
          });
        }
      }
    } else if (freq.includes('3 ngày') || freq.includes('3 days') || freq.includes('interval')) {
      for (let d = baseDay; d <= daysInCurrentMonth; d += 3) {
        newEventsToAdd.push({
          ...newEvent,
          id: Date.now() + d * 10,
          seriesId: generatedSeriesId,
          year,
          month,
          day: d,
        });
      }
    } else {
      newEventsToAdd.push({
        ...newEvent,
        id: Date.now(),
        year,
        month,
        day: baseDay,
      });
    }

    try {
      for (const item of newEventsToAdd) {
        const saved = eventFromDto(await eventApi.createEvent(eventPayload(item)));
        setEventsData(prev => [saved, ...prev.filter(e => e.backendId !== saved.backendId)]);
      }
      return true;
    } catch (e) { reportError(e); return false; }
  };

  const saveRoutine = async (event: Omit<CalendarEvent, 'id'>): Promise<boolean> => {
    try {
      const saved = await routineApi.createRoutine({ title: event.title, targetTime: event.time,
        frequencyType: event.frequency?.includes('tuần') ? 1 : event.frequency?.includes('3 ngày') ? 2 : 0,
        frequencyValue: event.frequency?.includes('3 ngày') ? 'INTERVAL_3' : undefined, subroutines: event.subroutines });
      const item = routineFromDto(saved, selectedYear, selectedMonth, selectedDay);
      setEventsData(prev => [item, ...prev.filter(e => e.backendId !== saved.id)]);
      return true;
    } catch (e) { reportError(e); return false; }
  };
  const deleteEvent = async (id: number, deleteAllSeries = false) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId) return;
    const targets = deleteAllSeries && target.seriesId ? eventsData.filter(e => e.seriesId === target.seriesId) : [target];
    try {
      for (const e of targets) {
        if (!e.backendId) continue;
        if (e.type === 'routine') await routineApi.deleteRoutine(e.backendId); else await eventApi.deleteEvent(e.backendId);
        setEventsData(prev => prev.filter(item => item.id !== e.id));
      }
    } catch (e) { reportError(e); }
  };
  const updateEvent = async (id: number, updated: Partial<CalendarEvent>) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId) return false;
    try {
      const next = { ...target, ...updated };
      if (target.type === 'routine') {
        const saved = await routineApi.updateRoutine(target.backendId, { title: next.title, targetTime: next.time, subroutines: next.subroutines, frequencyType: next.frequency?.includes('tuần') ? 1 : next.frequency?.includes('3 ngày') ? 2 : 0, frequencyValue: next.frequency?.includes('3 ngày') ? 'INTERVAL_3' : undefined });
        setEventsData(prev => prev.map(e => e.id === id ? routineFromDto(saved, selectedYear, selectedMonth, selectedDay) : e));
      } else {
        const saved = eventFromDto(await eventApi.updateEvent(target.backendId, eventPayload(next)));
        setEventsData(prev => prev.map(e => e.id === id ? saved : e));
      }
      return true;
    } catch (e) { reportError(e); return false; }
  };
  const toggleCheckInRoutine = async (id: number) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId) return;
    try {
      const saved = await routineApi.checkIn(target.backendId);
      setEventsData(prev => prev.map(e => e.id === id ? { ...e, completed: true, streak: saved.streakCount, subroutines: e.subroutines?.map(s => ({ ...s, completed: true })) } : e));
    } catch (e) { reportError(e); }
  };
  const addRoutine = (input: CreateRoutineInput) => saveRoutine({ ...input, type: 'routine', time: input.time || '07:00', priority: input.priority || 'medium', year: selectedYear, month: selectedMonth, day: selectedDay,
    subroutines: input.subroutines?.map((title, i) => ({ id: i + 1, title, completed: false })) });
  const reloadRoutine = async (routineId: number) => {
    const target = eventsData.find(e => e.id === routineId); if (!target?.backendId) return;
    const saved = (await routineApi.getRoutines()).find(r => r.id === target.backendId);
    if (saved) setEventsData(prev => prev.map(e => e.id === routineId ? routineFromDto(saved, selectedYear, selectedMonth, selectedDay) : e));
  };
  const addSubroutine = async (id: number, title: string) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId || !title.trim()) return;
    try { await routineApi.addSubroutine(target.backendId, title); await reloadRoutine(id); } catch (e) { reportError(e); }
  };
  const toggleSubroutine = async (id: number, subId: number) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId) return;
    try { await routineApi.toggleSubroutine(target.backendId, subId); await reloadRoutine(id); } catch (e) { reportError(e); }
  };
  const deleteSubroutine = async (id: number, subId: number) => {
    const target = eventsData.find(e => e.id === id); if (!target?.backendId) return;
    try { await routineApi.deleteSubroutine(target.backendId, subId); await reloadRoutine(id); } catch (e) { reportError(e); }
  };
  const reloadTasks = async () => setTasksData((await taskApi.getTasks()).filter(t => !t.parentId).map(taskFromDto));
  const addTask = async (input: string | CreateTaskInput, priority: Priority = 'medium') => {
    const data = typeof input === 'string' ? { title: input, priority } : input;
    try {
      const saved = await taskApi.createTask({ title: data.title, priority: priorityNumber(data.priority || 'medium'), dueDate: data.dueDate || undefined, categoryId: data.categoryId, colorTag: data.colorTag, reminderMinutesBefore: data.reminders ? parseInt(data.reminders) || undefined : undefined });
      await reloadTasks();
      for (const sub of data.subtasks || []) await taskApi.createTask({ title: sub.title, priority: 1, parentId: saved.id });
      await reloadTasks();
      return true;
    } catch (e) { reportError(e); return false; }
  };
  const addSubtask = async (id: number, title: string) => {
    const target = tasksData.find(t => t.id === id); if (!target?.backendId || !title.trim()) return;
    try { await taskApi.createTask({ title, priority: 1, parentId: target.backendId }); await reloadTasks(); } catch (e) { reportError(e); }
  };
  const deleteSubtask = async (taskId: number, subId: number) => {
    const sub = tasksData.find(t => t.id === taskId)?.subtasks.find(s => s.id === subId); if (!sub?.backendId) return;
    try { await taskApi.deleteTask(sub.backendId); await reloadTasks(); } catch (e) { reportError(e); }
  };
  const deleteTask = async (id: number) => {
    const target = tasksData.find(t => t.id === id); if (!target?.backendId) return;
    try { await taskApi.deleteTask(target.backendId); await reloadTasks(); } catch (e) { reportError(e); }
  };
  const updateTask = async (id: number, updated: Partial<TaskItem>) => {
    const target = tasksData.find(t => t.id === id); if (!target?.backendId) return false;
    try {
      const next = { ...target, ...updated };
      await taskApi.updateTask(target.backendId, { title: next.title, description: next.description, priority: priorityNumber(next.priority), status: next.completed ? 1 : 0, dueDate: next.dueDate || undefined, categoryId: next.categoryId, colorTag: next.colorTag, reminderMinutesBefore: next.reminders ? parseInt(next.reminders) || undefined : undefined });
      if (updated.subtasks) {
        for (let i = 0; i < updated.subtasks.length; i++) {
          const sub = updated.subtasks[i]; const old = target.subtasks[i];
          if (old?.backendId) await taskApi.updateTask(old.backendId, { title: sub.title, priority: 1, status: old.completed ? 1 : 0 });
          else await taskApi.createTask({ title: sub.title, priority: 1, parentId: target.backendId });
        }
        for (const old of target.subtasks.slice(updated.subtasks.length)) if (old.backendId) await taskApi.deleteTask(old.backendId);
      }
      await reloadTasks(); return true;
    } catch (e) { reportError(e); return false; }
  };
  const toggleTask = async (id: number) => {
    const target = tasksData.find(t => t.id === id); if (!target?.backendId) return;
    try { await taskApi.toggleTask(target.backendId); await reloadTasks(); } catch (e) { reportError(e); }
  };
  const toggleSubtask = async (taskId: number, subId: number) => {
    const sub = tasksData.find(t => t.id === taskId)?.subtasks.find(s => s.id === subId); if (!sub?.backendId) return;
    try { await taskApi.toggleTask(sub.backendId); await reloadTasks(); } catch (e) { reportError(e); }
  };
  const addCategory = async (name: string, color: string) => {
    try { const saved = await categoryApi.createCategory({ name, color }); setCategories(prev => [...prev.filter(c => c.id !== saved.id), saved]); setCategoryFilters(prev => ({ ...prev, [saved.id]: true })); }
    catch (e) { reportError(e); }
  };
  const deleteCategory = async (id: string) => {
    if (categories.find(c => c.id === id)?.isBuiltIn) return;
    try { await categoryApi.deleteCategory(id); setCategories(prev => prev.filter(c => c.id !== id)); }
    catch (e) { reportError(e); }
  };

  const toggleLeftSidebar = () => setIsLeftSidebarOpen((prev) => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen((prev) => !prev);

  const [settingsInitialTab, setSettingsInitialTab] = useState<string>('profile');

  const openModal = (modal: ActiveModalType, param?: any) => {
    if (modal === 'edit' && param?.type === 'event' && !eventsData.find(e => e.id === param.id)?.backendId) {
      showToast('Lịch chỉ xem', 'Ngày lễ và ngày sinh không phải sự kiện cá nhân trong DB.', 'info');
      return;
    }
    setActiveModal(modal);
    if (modal === 'edit' && param) {
      setActiveEditItem(param);
    } else if (typeof param === 'number') {
      setActiveEventId(param);
    } else if (typeof param === 'string') {
      setSettingsInitialTab(param);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveEventId(null);
    setActiveEditItem(null);
  };

  const triggerPremiumFeature = (featureName: string) => {
    if (currentRole === 'PREMIUM' || currentRole === 'TRIAL') {
      showToast('Tính năng VIP', `[${featureName}] đang hoạt động bình thường.`, 'success');
    } else {
      openModal('limit');
    }
  };

  return (
    <AppContext.Provider
      value={{
        eventsData,
        selectedDay,
        selectedMonth,
        selectedYear,
        calendarView,
        categories,
        categoryFilters,
        addCategory,
        deleteCategory,
        searchQuery,
        activeEventId,
        activeEditItem,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleCheckInRoutine,
        addRoutine,
        addSubroutine,
        toggleSubroutine,
        deleteSubroutine,
        setCalendarView: setCalendarViewMode,
        selectDate,
        selectToday,
        prevMonth,
        nextMonth,
        setCategoryFilters,
        setSearchQuery,
        tasksData,
        addTask,
        addSubtask,
        deleteSubtask,
        deleteTask,
        updateTask,
        toggleTask,
        toggleSubtask,
        isLeftSidebarOpen,
        isRightSidebarOpen,
        toggleLeftSidebar,
        toggleRightSidebar,
        rightSidebarTab,
        setRightSidebarTab,
        openRightSidebarTab,
        notesData,
        addNote,
        updateNote,
        toggleNotePin,
        deleteNote,
        toggleNoteChecklistItem,
        isDayInspectorOpen,
        openDayInspector,
        closeDayInspector,
        currentTheme,
        setTheme: (theme) => savePreferences({ themeCode: theme }),
        activeModal,
        settingsInitialTab,
        openModal,
        closeModal,
        activeRecurringEvent,
        recurringActionType,
        openRecurringModal,
        closeRecurringModal,
        triggerPremiumFeature,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
