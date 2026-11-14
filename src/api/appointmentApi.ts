import { apiClient } from './apiClient';

export interface DailyAvailabilitySlotDto {
  dayIndex: number;
  dayName: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface AvailabilitySettingDto {
  timezone: string;
  bookingSlug: string;
  defaultDurationMinutes: number;
  slots: DailyAvailabilitySlotDto[];
  publicBookingUrl: string;
}

export interface BookingDto {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  meetingTime: string;
  durationMinutes: number;
  topic?: string;
  meetUrl?: string;
  status: string;
}

export const appointmentApi = {
  getAvailability() {
    return apiClient.get<AvailabilitySettingDto>('/user/appointments/availability');
  },
  saveAvailability(data: {
    timezone?: string;
    bookingSlug?: string;
    defaultDurationMinutes?: number;
    slots: DailyAvailabilitySlotDto[];
  }) {
    return apiClient.put<{ message: string; publicBookingUrl: string }>('/user/appointments/availability', data);
  },
  getBookings() {
    return apiClient.get<BookingDto[]>('/user/appointments/bookings');
  },
  updateBookingStatus(id: string, status: number) {
    return apiClient.patch<{ id: string; status: string }>(`/user/appointments/bookings/${id}/status`, status);
  },
};

