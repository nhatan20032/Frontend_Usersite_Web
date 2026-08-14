import { apiClient } from './apiClient';

export interface EventDto {
  id: string;
  title: string;
  description?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  endTime: string;
  recurrenceRule?: string;
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
};
