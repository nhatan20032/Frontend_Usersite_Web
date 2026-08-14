import { apiClient } from './apiClient';

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  priority: number; // 0=Low, 1=Medium, 2=High, 3=Urgent
  status: number; // 0=Pending, 1=Completed, 2=Cancelled
  dueDate?: string;
  subTasks?: Array<{ id: string; title: string; status: number }>;
}

export const taskApi = {
  getTasks() {
    return apiClient.get<TaskDto[]>('/user/tasks');
  },
  createTask(data: { title: string; description?: string; priority: number; dueDate?: string; parentId?: string }) {
    return apiClient.post<TaskDto>('/user/tasks', data);
  },
  updateTask(id: string, data: { title: string; description?: string; priority: number; dueDate?: string; status: number }) {
    return apiClient.put<TaskDto>(`/user/tasks/${id}`, data);
  },
  toggleTask(id: string) {
    return apiClient.patch<{ id: string; status: string }>(`/user/tasks/${id}/toggle`);
  },
  deleteTask(id: string) {
    return apiClient.delete<{ message: string }>(`/user/tasks/${id}`);
  },
  getAiSuggestions(goal: string) {
    return apiClient.post<{ goal: string; suggestedTasks: any[]; message: string }>('/user/tasks/ai-suggest', goal);
  },
};
