import { apiClient } from '../api/apiClient';
import type { CalendarEvent } from '../types';
export const holidayPreferenceKey = 'routinepulse_holiday_region';
export function holidayRegion(): { country: string; subdivision: string } {
  try { return JSON.parse(localStorage.getItem(holidayPreferenceKey) || 'null') || { country: 'VN', subdivision: '' }; }
  catch { return { country: 'VN', subdivision: '' }; }
}
export interface HolidayResponse {
  source: string; fetchedAt: string;
  holidays: { date: string; name: string; regions: string[] }[];
}
export async function getVietnamHolidays(year = new Date().getFullYear()): Promise<CalendarEvent[]> {
  const result = await apiClient.get<HolidayResponse>('/user/holidays', { year, ...holidayRegion() });
  return result.holidays.map((h, index) => {
    const [eventYear, month, day] = h.date.split('-').map(Number);
    return { id: 910000000 + year * 1000 + index, type: 'event', title: h.name,
      time: 'Cả ngày', priority: 'medium', year: eventYear, month, day,
      colorTag: '#C58AF9', categoryId: 'holiday', status: 'free',
      description: `Ngày lễ từ ${result.source}\nCập nhật: ${new Date(result.fetchedAt).toLocaleString()}. Theo công bố của nguồn; lịch nghỉ đơn vị có thể khác.` };
  });
}
