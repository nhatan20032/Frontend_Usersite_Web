import type { CalendarEvent, TaskItem } from '../types';
import type { EventDto } from './eventApi';
import type { RoutineDto } from './routineApi';
import type { TaskDto } from './taskApi';

// Numeric UI keys stay stable while API operations always use the original UUID.
const ids = new Map<string, number>();
let nextId = 1000000000;
export const uiId = (id: string): number => {
  if (!ids.has(id)) ids.set(id, nextId++);
  return ids.get(id)!;
};
export const priorityNumber = (priority: string) => priority === 'high' ? 2 : priority === 'low' ? 0 : 1;
export const taskFromDto = (t: TaskDto): TaskItem => ({
  id: uiId(t.id), backendId: t.id, title: t.title, description: t.description,
  dueDate: t.dueDate || '', priority: Number(t.priority) >= 2 ? 'high' : Number(t.priority) === 0 ? 'low' : 'medium',
  completed: t.status === 1, categoryId: t.categoryId, colorTag: t.colorTag, reminders: t.reminderMinutesBefore == null ? undefined : `${t.reminderMinutesBefore}m`,
  subtasks: (t.subTasks || []).map(s => ({ id: uiId(s.id), backendId: s.id, title: s.title, completed: s.status === 1 })),
});
export const eventFromDto = (e: EventDto): CalendarEvent => {
  const start = new Date(e.startTime);
  return { id: uiId(e.id), backendId: e.id, type: 'event', title: e.title,
    time: start.toTimeString().slice(0, 5), endTime: new Date(e.endTime).toTimeString().slice(0, 5),
    year: start.getFullYear(), month: start.getMonth(), day: start.getDate(), priority: (e.priority || 0) >= 2 ? 'high' : e.priority === 0 ? 'low' : 'medium',
    categoryId: e.categoryId, attendees: e.attendees, status: e.availabilityStatus, reminderMinutesBefore: e.alertTime ? Math.round((start.getTime() - new Date(e.alertTime).getTime()) / 60000) : undefined,
    alertTime: e.alertTime ? new Date(e.alertTime).toLocaleString() : undefined,
    location: e.locationText, description: e.description, colorTag: e.colorTag, seriesId: e.seriesId,
  };
};
export const routineFromDto = (r: RoutineDto, year: number, month: number, day: number): CalendarEvent => ({
  id: uiId(r.id), backendId: r.id, type: 'routine', title: r.title, time: r.targetTime || '07:00',
  year, month, day, priority: 'medium', streak: r.streakCount, completed: r.completedToday || false,
  frequency: r.frequencyType === 1 ? 'Hàng tuần' : r.frequencyType === 2 ? 'Tùy chỉnh' : 'Hàng ngày', subroutines: r.subroutines || [],
});
export const eventPayload = (e: Omit<CalendarEvent, 'id'>) => {
  const dateAt = (time: string) => {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) throw new Error('Giờ không hợp lệ');
    let hour = Number(match[1]);
    if (match[3] && hour <= 12) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
    return new Date(e.year, e.month, e.day, hour, Number(match[2]));
  };
  const start = dateAt(e.time);
  const end = e.endTime ? dateAt(e.endTime) : new Date(start.getTime() + 3600000);
  if (end <= start) throw new Error('Giờ kết thúc phải sau giờ bắt đầu');
  return { title: e.title, description: e.description, locationText: e.location, startTime: start.toISOString(), endTime: end.toISOString(), colorTag: e.colorTag, seriesId: e.seriesId, categoryId: e.categoryId, attendees: e.attendees, priority: priorityNumber(e.priority), availabilityStatus: e.status, reminderMinutesBefore: e.reminderMinutesBefore };
};
