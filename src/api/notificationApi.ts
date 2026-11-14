import { apiClient } from './apiClient';

export interface UserNotificationDto {
  id: string;
  title: string;
  content: string;
  type: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPagedResponse {
  data: UserNotificationDto[];
  totalCount: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}

export const notificationApi = {
  getNotifications(params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) {
    return apiClient.get<NotificationPagedResponse>('/user/notifications', params);
  },
  markAsRead(id: string) {
    return apiClient.patch<{ id: string; isRead: boolean }>(`/user/notifications/${id}/read`);
  },
  markAllAsRead() {
    return apiClient.patch<{ message: string }>('/user/notifications/read-all');
  },
  deleteNotification(id: string) {
    return apiClient.delete<{ message: string }>(`/user/notifications/${id}`);
  },
};

