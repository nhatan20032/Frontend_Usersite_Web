import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CalendarEvent,
  TaskItem,
  CreateTaskInput,
  CreateRoutineInput,
  CalendarViewMode,
  ThemeName,
  CategoryFilters,
  ToastNotification,
  ToastType,
  ActiveModalType,
  Priority,
  RightSidebarTab,
  KeepNote,
} from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Calendar & Events
  eventsData: CalendarEvent[];
  selectedDay: number;
  selectedMonth: number; // 0-indexed (0 = Jan, 11 = Dec)
  selectedYear: number;
  calendarView: CalendarViewMode;
  categoryFilters: CategoryFilters;
  searchQuery: string;
  activeEventId: number | null;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => boolean;
  deleteEvent: (id: number, deleteAllSeries?: boolean) => void;
  activeRecurringEvent: CalendarEvent | null;
  recurringActionType: 'delete' | 'edit';
  openRecurringModal: (event: CalendarEvent, action?: 'delete' | 'edit') => void;
  closeRecurringModal: () => void;
  toggleCheckInRoutine: (id: number) => void;
  addRoutine: (input: CreateRoutineInput) => void;
  addSubroutine: (routineId: number, title: string) => void;
  toggleSubroutine: (routineId: number, subroutineId: number) => void;
  deleteSubroutine: (routineId: number, subroutineId: number) => void;
  setCalendarView: (view: CalendarViewMode) => void;
  selectDate: (day: number, month?: number, year?: number) => void;
  selectToday: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  setCategoryFilters: React.Dispatch<React.SetStateAction<CategoryFilters>>;
  setSearchQuery: (query: string) => void;

  // Tasks & Subtasks
  tasksData: TaskItem[];
  addTask: (input: string | CreateTaskInput, priority?: Priority) => void;
  addSubtask: (taskId: number, title: string) => void;
  deleteSubtask: (taskId: number, subtaskId: number) => void;
  deleteTask: (id: number) => void;
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
  addNote: (note: Omit<KeepNote, 'id' | 'updatedAt'>) => void;
  toggleNotePin: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleNoteChecklistItem: (noteId: string, itemId: string) => void;

  // Day Inspector
  isDayInspectorOpen: boolean;
  openDayInspector: (day?: number) => void;
  closeDayInspector: () => void;

  // Theme
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;

  // Modals & Navigation
  activeModal: ActiveModalType;
  openModal: (modal: ActiveModalType, eventId?: number) => void;
  closeModal: () => void;
  triggerPremiumFeature: (featureName: string) => void;

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const getInitialSampleEvents = (year: number, month: number, day: number): CalendarEvent[] => [
  {
    id: 1,
    type: 'routine',
    title: 'Chạy bộ 30 phút buổi sáng',
    time: '06:30 AM',
    priority: 'high',
    streak: 14,
    completed: false,
    year,
    month,
    day,
    frequency: 'Hàng ngày',
    subroutines: [
      { id: 1, title: 'Uống 300ml nước ấm sau khi ngủ dậy', completed: true },
      { id: 2, title: 'Khởi động khớp gối & cổ chân 5 phút', completed: true },
      { id: 3, title: 'Chạy 3.5km với nhịp pace 6:15', completed: false },
    ],
  },
  {
    id: 2,
    type: 'event',
    title: 'Hội thảo Công Nghệ & AI Summit',
    time: '14:00 PM',
    priority: 'high',
    location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
    travelTime: '25 phút',
    alertTime: '13:35 PM',
    year,
    month,
    day,
  },
  {
    id: 3,
    type: 'routine',
    title: 'Đọc sách chuyên ngành 20 trang',
    time: '22:00 PM',
    priority: 'medium',
    streak: 7,
    completed: false,
    year,
    month,
    day,
    frequency: 'Hàng ngày',
    subroutines: [
      { id: 1, title: 'Chọn 1 chương mục tiêu trong sách', completed: true },
      { id: 2, title: 'Đọc tập trung 25 phút Pomodoro', completed: false },
      { id: 3, title: 'Note lại 3 ý tưởng cốt lõi vào Keep', completed: false },
    ],
  },
  {
    id: 4,
    type: 'routine',
    title: 'Tập Gym chu kỳ interval',
    time: '07:30 AM',
    priority: 'high',
    streak: 45,
    isPremium: true,
    frequency: 'Cứ 3 ngày 1 lần',
    year,
    month,
    day: Math.min(day + 1, 28),
    subroutines: [
      { id: 1, title: 'Khởi động khớp & làm nóng 5 phút', completed: true },
      { id: 2, title: '4 set Squats (8-10 reps)', completed: false },
      { id: 3, title: '3 set Bench Press (tạ đòn)', completed: false },
      { id: 4, title: 'Căng cơ hạ nhiệt 5 phút', completed: false },
    ],
  },
  {
    id: 5,
    type: 'event',
    title: 'Báo cáo Tiến độ Đồ án với Giảng viên',
    time: '09:30 AM',
    priority: 'high',
    location: 'Đại học Bách Khoa',
    travelTime: '15 phút',
    alertTime: '09:15 AM',
    year,
    month,
    day: Math.min(day + 2, 28),
  },
  {
    id: 6,
    type: 'routine',
    title: 'Học 20 từ vựng Tiếng Anh',
    time: '21:00 PM',
    priority: 'low',
    streak: 19,
    completed: true,
    year,
    month,
    day,
    frequency: 'Hàng ngày',
    subroutines: [
      { id: 1, title: 'Ôn lại từ cũ trên Flashcard', completed: true },
      { id: 2, title: 'Học 20 từ mới theo chủ đề', completed: true },
      { id: 3, title: 'Đặt 5 câu ví dụ thực tế', completed: true },
    ],
  },
];

const getInitialSampleTasks = (): TaskItem[] => [
  {
    id: 101,
    title: 'Nộp báo cáo Đồ án tốt nghiệp',
    dueDate: '17:00 PM',
    priority: 'high',
    completed: false,
    reminders: 'Push App • SMS • Email',
    subtasks: [
      { id: 1, title: 'Khảo sát yêu cầu & đặc tả bài toán', completed: true },
      { id: 2, title: 'Viết tài liệu mô tả chức năng', completed: true },
      { id: 3, title: 'Hoàn thiện báo cáo PDF cuối cùng', completed: false },
    ],
  },
  {
    id: 102,
    title: 'Chuẩn bị Keynote thuyết trình',
    dueDate: '09:00 AM',
    priority: 'medium',
    completed: false,
    reminders: 'Push App • Voice Call',
    subtasks: [
      { id: 1, title: 'Thiết kế slide 15 trang', completed: false },
      { id: 2, title: 'Chạy thử demo tính năng trực tiếp', completed: false },
    ],
  },
  {
    id: 103,
    title: 'Mua quà biếu gia đình',
    dueDate: 'Hôm nay',
    priority: 'low',
    completed: true,
    reminders: 'Push App',
    subtasks: [],
  },
];

const getInitialSampleNotes = (): KeepNote[] => [
  {
    id: 'note-1',
    title: 'Kỷ luật & Thói quen cốt lõi',
    content: 'Nguyên tắc bất di bất dịch:\n• Ngủ trước 23:00, không màn hình xanh sau 22:30\n• Review tiến độ qua checklist mỗi 17:30',
    isPinned: true,
    color: 'amber',
    tags: ['KỷLuật', 'Mindset'],
    checklist: [
      { id: 'c1', text: 'Ngủ trước 23:00, không màn hình xanh sau 22:30', completed: true },
      { id: 'c2', text: 'Review tiến độ qua checklist mỗi 17:30', completed: false },
    ],
    updatedAt: 'Hôm nay',
  },
  {
    id: 'note-2',
    title: 'Kế hoạch Release v2.4 RoutinePulse',
    content: 'Tích hợp companion dock vào core-engine; benchmark latency mini calendar; sync local state.',
    isPinned: false,
    color: 'blue',
    tags: ['DựÁnQ3'],
    updatedAt: '10:30 Hôm nay',
  },
  {
    id: 'note-3',
    title: 'Trích dẫn: Atomic Habits',
    content: '“Bạn không vươn lên tới tầm của mục tiêu; bạn tụt xuống mức độ của các hệ thống thói quen.”',
    isPinned: false,
    color: 'purple',
    tags: ['Reading'],
    updatedAt: 'Hôm qua',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRole } = useAuth();

  // Dynamic real system date initialization
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(() => now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(() => now.getDate());

  // Persistent storage for Events and Tasks
  const [eventsData, setEventsData] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('routinepulse_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing routinepulse_events', err);
      }
    }
    return getInitialSampleEvents(now.getFullYear(), now.getMonth(), now.getDate());
  });

  const [tasksData, setTasksData] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('routinepulse_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing routinepulse_tasks', err);
      }
    }
    return getInitialSampleTasks();
  });

  useEffect(() => {
    localStorage.setItem('routinepulse_events', JSON.stringify(eventsData));
  }, [eventsData]);

  useEffect(() => {
    localStorage.setItem('routinepulse_tasks', JSON.stringify(tasksData));
  }, [tasksData]);

  const [calendarView, setCalendarViewMode] = useState<CalendarViewMode>('month');
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({ routine: true, event: true, task: true });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('tasks');

  const [notesData, setNotesData] = useState<KeepNote[]>(() => {
    const saved = localStorage.getItem('routinepulse_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing routinepulse_notes', err);
      }
    }
    return getInitialSampleNotes();
  });

  useEffect(() => {
    localStorage.setItem('routinepulse_notes', JSON.stringify(notesData));
  }, [notesData]);

  const openRightSidebarTab = (tab: RightSidebarTab) => {
    if (isRightSidebarOpen && rightSidebarTab === tab) {
      setIsRightSidebarOpen(false);
    } else {
      setRightSidebarTab(tab);
      setIsRightSidebarOpen(true);
    }
  };

  const addNote = (note: Omit<KeepNote, 'id' | 'updatedAt'>) => {
    const newNote: KeepNote = {
      ...note,
      id: 'note-' + Date.now(),
      updatedAt: 'Vừa xong',
    };
    setNotesData((prev) => [newNote, ...prev]);
    showToast('Ghi chú mới', `Đã lưu "${newNote.title || 'Ghi chú không tiêu đề'}"`, 'success');
  };

  const toggleNotePin = (id: string) => {
    setNotesData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotesData((prev) => prev.filter((n) => n.id !== id));
    showToast('Đã xóa', 'Ghi chú đã được xóa', 'info');
  };

  const toggleNoteChecklistItem = (noteId: string, itemId: string) => {
    setNotesData((prev) =>
      prev.map((n) => {
        if (n.id !== noteId || !n.checklist) return n;
        return {
          ...n,
          checklist: n.checklist.map((c) =>
            c.id === itemId ? { ...c, completed: !c.completed } : c
          ),
        };
      })
    );
  };

  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Apply Theme to body class
  useEffect(() => {
    const body = document.body;
    body.className = body.className.replace(/theme-\w+/g, '').trim();
    if (currentTheme !== 'default') {
      body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

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

  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>): boolean => {
    if (newEvent.type === 'routine') {
      const routineCount = eventsData.filter((e) => e.type === 'routine').length;
      if (currentRole === 'FREE' && routineCount >= 10) {
        triggerPremiumFeature('Tạo hơn 10 thói quen lặp lại');
        return false;
      }
    }

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

    setEventsData((prev) => [...newEventsToAdd, ...prev]);
    showToast(
      'Khởi tạo thành công',
      newEventsToAdd.length > 1
        ? `Đã tạo chuỗi lặp [${newEvent.title}] cho ${newEventsToAdd.length} ngày trong tháng!`
        : `Đã lưu [${newEvent.title}] vào lịch trình.`,
      'success'
    );
    return true;
  };

  const deleteEvent = (id: number, deleteAllSeries: boolean = false) => {
    const target = eventsData.find((e) => e.id === id);
    if (!target) return;

    if (deleteAllSeries) {
      const targetSeriesId = target.seriesId;
      const targetTitle = target.title.trim();
      setEventsData((prev) =>
        prev.filter((e) => {
          if (targetSeriesId && e.seriesId === targetSeriesId) return false;
          if (e.title.trim() === targetTitle && e.type === target.type) return false;
          return true;
        })
      );
      showToast('Đã xóa toàn bộ chuỗi', `Đã dọn dẹp toàn bộ chuỗi [${target.title}] khỏi lịch.`, 'info');
    } else {
      setEventsData((prev) => prev.filter((e) => e.id !== id));
      showToast('Đã xóa sự kiện', `Đã xóa [${target.title}] cho ngày này.`, 'info');
    }
  };

  const toggleCheckInRoutine = (id: number) => {
    const target = eventsData.find((e) => e.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    const nextStreak = nextCompleted ? (target.streak || 0) + 1 : Math.max(1, (target.streak || 1) - 1);
    setEventsData((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          // Toggle all subroutines to match routine completed state
          const updatedSubs = (e.subroutines || []).map((s) => ({
            ...s,
            completed: nextCompleted,
          }));
          return {
            ...e,
            completed: nextCompleted,
            streak: nextStreak,
            subroutines: updatedSubs,
          };
        }
        return e;
      })
    );
    if (nextCompleted) {
      showToast('Điểm danh thành công', `Chuỗi thói quen [${target.title}] đạt ${nextStreak} ngày liên tục.`, 'success');
    } else {
      showToast('Hủy điểm danh', `Đã hoàn tác trạng thái [${target.title}].`, 'info');
    }
  };

  const addRoutine = (input: CreateRoutineInput) => {
    const newRoutine: CalendarEvent = {
      id: Date.now(),
      type: 'routine',
      title: input.title,
      time: input.time || '07:00 AM',
      priority: input.priority || 'medium',
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      streak: 1,
      completed: false,
      frequency: input.frequency || 'Hàng ngày',
      subroutines: (input.subroutines || []).map((st, idx) => ({
        id: Date.now() + idx + 1,
        title: st,
        completed: false,
      })),
    };
    setEventsData((prev) => [newRoutine, ...prev]);
    showToast('Tạo thói quen thành công', `[${input.title}]`, 'success');
  };

  const addSubroutine = (routineId: number, title: string) => {
    if (!title.trim()) return;
    setEventsData((prev) =>
      prev.map((e) => {
        if (e.id === routineId) {
          const newSub = {
            id: Date.now(),
            title: title.trim(),
            completed: false,
          };
          const currentSubs = e.subroutines || [];
          return {
            ...e,
            completed: false,
            subroutines: [...currentSubs, newSub],
          };
        }
        return e;
      })
    );
  };

  const toggleSubroutine = (routineId: number, subroutineId: number) => {
    setEventsData((prev) =>
      prev.map((e) => {
        if (e.id === routineId) {
          const currentSubs = e.subroutines || [];
          const updatedSubs = currentSubs.map((s) =>
            s.id === subroutineId ? { ...s, completed: !s.completed } : s
          );
          const allDone = updatedSubs.length > 0 && updatedSubs.every((s) => s.completed);
          const nextStreak = allDone && !e.completed
            ? (e.streak || 0) + 1
            : !allDone && e.completed
            ? Math.max(1, (e.streak || 1) - 1)
            : (e.streak || 1);
          return {
            ...e,
            completed: allDone,
            streak: nextStreak,
            subroutines: updatedSubs,
          };
        }
        return e;
      })
    );
  };

  const deleteSubroutine = (routineId: number, subroutineId: number) => {
    setEventsData((prev) =>
      prev.map((e) => {
        if (e.id === routineId) {
          const currentSubs = e.subroutines || [];
          const updatedSubs = currentSubs.filter((s) => s.id !== subroutineId);
          const allDone = updatedSubs.length > 0 && updatedSubs.every((s) => s.completed);
          return {
            ...e,
            completed: allDone,
            subroutines: updatedSubs,
          };
        }
        return e;
      })
    );
  };

  const addTask = (input: string | CreateTaskInput, priority: Priority = 'medium') => {
    let newTask: TaskItem;
    if (typeof input === 'string') {
      newTask = {
        id: Date.now(),
        title: input,
        dueDate: 'Hôm nay',
        priority,
        completed: false,
        reminders: 'Push App',
        subtasks: [],
      };
    } else {
      newTask = {
        id: Date.now(),
        title: input.title,
        dueDate: input.dueDate || 'Hôm nay',
        priority: input.priority || 'medium',
        completed: false,
        reminders: input.reminders || 'Push App',
        subtasks: (input.subtasks || []).map((st, idx) => ({
          id: Date.now() + idx + 1,
          title: st.title,
          completed: !!st.completed,
        })),
      };
    }
    setTasksData((prev) => [newTask, ...prev]);
    showToast('Tạo công việc thành công', `[${newTask.title}]`, 'success');
  };

  const addSubtask = (taskId: number, title: string) => {
    if (!title.trim()) return;
    setTasksData((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubtask = {
            id: Date.now(),
            title: title.trim(),
            completed: false,
          };
          return { ...t, subtasks: [...t.subtasks, newSubtask] };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: number, subtaskId: number) => {
    setTasksData((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasksData((prev) => prev.filter((t) => t.id !== id));
    showToast('Đã xóa', 'Đã loại bỏ công việc khỏi danh sách.', 'info');
  };

  const toggleTask = (id: number) => {
    const target = tasksData.find((t) => t.id === id);
    if (!target) return;
    const next = !target.completed;
    setTasksData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: next } : t))
    );
    showToast(next ? 'Đã hoàn thành công việc' : 'Mở lại công việc', `[${target.title}]`, 'info');
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasksData((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const toggleLeftSidebar = () => setIsLeftSidebarOpen((prev) => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen((prev) => !prev);

  const openModal = (modal: ActiveModalType, eventId?: number) => {
    setActiveModal(modal);
    if (eventId !== undefined) {
      setActiveEventId(eventId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveEventId(null);
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
        categoryFilters,
        searchQuery,
        activeEventId,
        addEvent,
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
        toggleNotePin,
        deleteNote,
        toggleNoteChecklistItem,
        isDayInspectorOpen,
        openDayInspector,
        closeDayInspector,
        currentTheme,
        setTheme: setCurrentTheme,
        activeModal,
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
