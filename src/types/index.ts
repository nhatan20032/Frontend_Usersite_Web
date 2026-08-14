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

export type ActiveModalType = 'create' | 'detail' | 'checkout' | 'limit' | 'settings' | 'upgrade' | 'recurring-action' | null;

export interface CategoryFilters {
  routine: boolean;
  event: boolean;
  task: boolean;
}
