export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'VIP';
export type AccountRole = 'FREE' | 'TRIAL' | 'PREMIUM' | 'FREE_USER' | 'PREMIUM_USER' | 'SUPER_ADMIN';
export type Language = 'vi' | 'en';

export interface User {
  id?: string;
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone?: string;
  role: AccountRole;
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  planName?: string;
  planExpiresAt?: string;
  features?: string[];
  avatarInitial: string;
}

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  durationMonths: number;
  originalPrice: number;
  featuresJson?: string;
  isPopular: boolean;
  isActive: boolean;
}

export type ThemeName = 'default' | 'dark' | 'tet' | 'christmas' | 'sakura';

export type CalendarViewMode = 'month' | 'week' | 'agenda';

export type Priority = 'high' | 'medium' | 'low';

export interface CalendarEvent {
  id: number;
  type: 'routine' | 'event';
  title: string;
  time: string;
  endTime?: string;
  priority: Priority;
  year: number;
  month: number; // 0-11
  day: number;
  streak?: number;
  completed?: boolean;
  isPremium?: boolean;
  frequency?: string;
  seriesId?: string;
  location?: string;
  travelTime?: string;
  alertTime?: string;
  description?: string;
  attendees?: string[];
  hasMeet?: boolean;
  colorTag?: string;
  status?: 'busy' | 'free';
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

export type ActiveModalType = 'create' | 'detail' | 'checkout' | 'limit' | 'settings' | 'upgrade' | 'recurring-action' | 'appointment-schedule' | null;

export interface DailyAvailabilitySlot {
  id: string;
  dayIndex: number; // 0: Sunday, 1: Monday, ... 6: Saturday
  dayNameVi: string;
  dayNameEn: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface CategoryFilters {
  routine: boolean;
  event: boolean;
  task: boolean;
}

export type RightSidebarTab = 'tasks' | 'notes-routine' | 'contacts';

export interface NoteChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface KeepNote {
  id: string;
  title: string;
  content?: string;
  isPinned?: boolean;
  color?: 'amber' | 'blue' | 'green' | 'purple';
  tags?: string[];
  checklist?: NoteChecklistItem[];
  updatedAt: string;
}
