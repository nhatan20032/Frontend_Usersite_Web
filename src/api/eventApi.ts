import { apiClient } from './apiClient';

export interface EventDto {
  id: string;
  categoryId?: string;
  attendees?: string[];
  priority?: number;
  availabilityStatus?: 'busy' | 'free';
  visibility?: 'private' | 'friends' | 'public';
  alertTime?: string;
  title: string;
  description?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  endTime: string;
  recurrenceRule?: string;
  colorTag?: string;
  seriesId?: string;
  isMasked?: boolean;
  ownerId?: string;
  ownerName?: string;
  attendeeResponses?: Record<string, 'PENDING' | 'ACCEPTED' | 'DECLINED'>;
  isInvited?: boolean;
  myResponseStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  organizerEmail?: string;
  organizerName?: string;
}

export interface FreeBusySlotDto {
  startTime: string;
  endTime: string;
  title: string;
  isPrivate: boolean;
}

export interface FreeBusyUserDto {
  email: string;
  fullName?: string;
  exists: boolean;
  busySlots: FreeBusySlotDto[];
}

export interface ConnectedFriendDto {
  id: string;
  friendUserId: string;
  name: string;
  email: string;
  avatarBg: string;
}

export const eventApi = {
  getEvents(year?: number, month?: number) {
    return apiClient.get<EventDto[]>('/user/events', { year, month });
  },
  createEvent(data: {
    title: string;
    description?: string;
    locationText?: string;
    latitude?: number;
    longitude?: number;
    startTime: string;
    endTime: string;
    recurrenceRule?: string;
    colorTag?: string;
    seriesId?: string;
    visibility?: string;
    categoryId?: string;
    attendees?: string[];
    priority?: number;
    availabilityStatus?: string;
    reminderMinutesBefore?: number;
  }) {
    return apiClient.post<EventDto>('/user/events', data);
  },
  updateEvent(id: string, data: any) {
    return apiClient.put<EventDto>(`/user/events/${id}`, data);
  },
  deleteEvent(id: string) {
    return apiClient.delete<{ message: string }>(`/user/events/${id}`);
  },
  configureTravelAlert(id: string, alertMinutesBefore: number) {
    return apiClient.post<{ eventId: string; alertTime: string; travelEstimate: string; message: string }>(
      `/user/events/${id}/travel-alert`,
      alertMinutesBefore
    );
  },
  getConnectedFriends() {
    return apiClient.get<ConnectedFriendDto[]>('/user/events/friends');
  },
  getSharedFriendEvents(friendUserId: string, year?: number, month?: number) {
    return apiClient.get<EventDto[]>('/user/events/shared', { friendUserId, year, month });
  },
  getFreeBusy(emails: string[], date: string) {
    return apiClient.get<FreeBusyUserDto[]>('/user/events/free-busy', {
      emails: emails.join(','),
      date,
    });
  },
  respondToEvent(id: string, status: 'ACCEPTED' | 'DECLINED' | 'PENDING') {
    return apiClient.post<{
      message: string;
      status: string;
      attendeeResponses: Record<string, 'PENDING' | 'ACCEPTED' | 'DECLINED'>;
    }>(`/user/events/${id}/respond`, { status });
  },
};
