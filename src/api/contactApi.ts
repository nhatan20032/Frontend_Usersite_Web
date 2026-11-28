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
  connectionStatus?: 'NONE' | 'PENDING' | 'OUTGOING' | 'INCOMING' | 'CONNECTED';
  friendUserId?: string;
}

export interface UserLookupResult {
  exists: boolean;
  isSelf: boolean;
  message?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  connectionStatus?: 'NONE' | 'PENDING' | 'OUTGOING' | 'INCOMING' | 'CONNECTED';
  isIncomingRequest?: boolean;
  contactId?: string;
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
  requestConnect(id: string) {
    return apiClient.post<{ message: string; contact: UserContactDto }>(`/user/contacts/${id}/request-connect`);
  },
  acceptConnect(id: string) {
    return apiClient.post<{ message: string; contact: UserContactDto }>(`/user/contacts/${id}/accept-connect`);
  },
  disconnect(id: string) {
    return apiClient.post<{ message: string; contact: UserContactDto }>(`/user/contacts/${id}/disconnect`);
  },
  lookupUser(email: string) {
    return apiClient.get<UserLookupResult>('/user/contacts/lookup-user', { email });
  },
  sendFriendRequest(targetUserId: string) {
    return apiClient.post<{ message: string; contact: UserContactDto }>('/user/contacts/send-friend-request', { targetUserId });
  },
  acceptFriend(targetUserId: string) {
    return apiClient.post<{ message: string; contact: UserContactDto }>(`/user/contacts/accept-friend/${targetUserId}`);
  },
};
