import { apiClient } from './apiClient';

export interface UserCategoryDto {
  id: string;
  name: string;
  color: string;
}

export const categoryApi = {
  getCategories() {
    return apiClient.get<UserCategoryDto[]>('/user/categories');
  },
  createCategory(data: { name: string; color?: string }) {
    return apiClient.post<UserCategoryDto>('/user/categories', data);
  },
  updateCategory(id: string, data: { name?: string; color?: string }) {
    return apiClient.put<UserCategoryDto>(`/user/categories/${id}`, data);
  },
  deleteCategory(id: string) {
    return apiClient.delete<{ message: string }>(`/user/categories/${id}`);
  },
};

