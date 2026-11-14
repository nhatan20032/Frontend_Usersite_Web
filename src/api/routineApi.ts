import { apiClient } from './apiClient';

export interface RoutineDto {
  id: string;
  targetTime?: string;
  completedToday?: boolean;
  subroutines?: Array<{ id: number; title: string; completed: boolean }>;
  title: string;
  frequencyType: number; // 0=Daily, 1=Weekly, 2=CustomDays
  frequencyValue?: string;
  streakCount: number;
  maxStreak: number;
  isActive: boolean;
}

export const routineApi = {
  updateRoutine: (id: string, data: any) => apiClient.put<RoutineDto>(`/user/routines/${id}`, data),
  addSubroutine: (id: string, title: string) => apiClient.post(`/user/routines/${id}/subroutines`, { title }),
  toggleSubroutine: (id: string, subId: number) => apiClient.patch(`/user/routines/${id}/subroutines/${subId}/toggle`),
  deleteSubroutine: (id: string, subId: number) => apiClient.delete(`/user/routines/${id}/subroutines/${subId}`),
  getRoutines() {
    return apiClient.get<RoutineDto[]>('/user/routines');
  },
  createRoutine(data: { title: string; frequencyType: number; frequencyValue?: string; targetTime?: string; subroutines?: Array<{ id: number; title: string; completed: boolean }> }) {
    return apiClient.post<RoutineDto>('/user/routines', data);
  },
  checkIn(id: string) {
    return apiClient.post<{ id: string; title: string; streakCount: number; maxStreak: number; message: string }>(
      `/user/routines/${id}/checkin`
    );
  },
  deleteRoutine(id: string) {
    return apiClient.delete<{ message: string }>(`/user/routines/${id}`);
  },
  getTemplates() {
    return apiClient.get<any[]>('/user/routines/templates');
  },
  createPremiumRoutine(routineConfig: string) {
    return apiClient.post<{ message: string; config: string }>('/user/routines/premium-routine', routineConfig);
  },
};
