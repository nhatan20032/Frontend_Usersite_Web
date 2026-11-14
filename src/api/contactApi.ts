import { apiClient } from './apiClient';

export interface UserContactDto {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  group: 'work' | 'client' | 'personal';
  avatarBg: string;
  status: 'online' | 'busy' | 'offline';
}

export const contactApi = {
  getContacts(params?: { search?: string; group?: string }) {
    return apiClient.get<UserContactDto[]>('/user/contacts', params);
  },
  createContact(data: {
    name: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    group?: string;
    avatarBg?: string;
    status?: string;
  }) {
    return apiClient.post<UserContactDto>('/user/contacts', data);
  },
  updateContact(
    id: string,
    data: {
      name: string;
      email: string;
      phoneNumber?: string;
      role?: string;
      group?: string;
      avatarBg?: string;
      status?: string;
    }
  ) {
    return apiClient.put<UserContactDto>(`/user/contacts/${id}`, data);
  },
  deleteContact(id: string) {
    return apiClient.delete<{ message: string }>(`/user/contacts/${id}`);
  },
};

