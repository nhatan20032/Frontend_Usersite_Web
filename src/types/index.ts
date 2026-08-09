export type AccountRole = 'FREE' | 'TRIAL' | 'PREMIUM';

export interface User {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  role: AccountRole;
  avatarInitial: string;
}

export type ThemeName = 'default' | 'dark' | 'tet' | 'christmas' | 'sakura';

export type CalendarViewMode = 'month' | 'week' | 'agenda';

export type Priority = 'high' | 'medium' | 'low';

export interface CalendarEvent {
  id: number;
  type: 'routine' | 'event';
  title: string;
  time: string;
  priority: Priority;
  year: number;
  month: number; // 0-11
  day: number;
  streak?: number;
  completed?: boolean;
  isPremium?: boolean;
  frequency?: string;
  location?: string;
  travelTime?: string;
  alertTime?: string;
}

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: number;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  reminders?: string;
  subtasks: SubTask[];
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export type ActiveModalType = 'create' | 'detail' | 'checkout' | 'limit' | 'settings' | null;

export interface CategoryFilters {
  routine: boolean;
  event: boolean;
  task: boolean;
}
