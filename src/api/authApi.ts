import { apiClient } from './apiClient';

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  referralCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    birthday?: string;
    role: string;
    subscriptionTier: 'FREE' | 'BASIC' | 'PRO' | 'VIP';
    isPremium: boolean;
    planName?: string;
    planExpiresAt?: string;
    features: string[];
  };
}

export const authApi = {
  updateProfile: (data: { fullName: string; phone: string; birthday?: string }) => apiClient.put('/user/auth/profile', data),
  register(data: RegisterDto) {
    return apiClient.post<AuthResponse>('/user/auth/register', data);
  },
  login(data: LoginDto) {
    let deviceId = localStorage.getItem('web_device_id');
    if (!deviceId) { deviceId = crypto.randomUUID(); localStorage.setItem('web_device_id', deviceId); }
    return apiClient.post<AuthResponse>('/user/auth/login', { ...data, deviceId, deviceName: 'RoutinePulse Web', platform: 0 });
  },
  getProfile() {
    return apiClient.get<AuthResponse['user']>('/user/auth/me');
  },
  refreshToken(refreshToken: string) {
    return apiClient.post<{ token: string; refreshToken: string; expiresAt: string }>('/user/auth/refresh-token', { refreshToken });
  },
  logout(refreshToken?: string, deviceId?: string) {
    return apiClient.post<{ message: string }>('/user/auth/logout', { refreshToken, deviceId });
  },
  forgotPassword(email: string) {
    return apiClient.post<{ message: string }>('/user/auth/forgot-password', { email });
  },
  resetPassword(email: string, token: string, newPassword: string) {
    return apiClient.post<{ message: string }>('/user/auth/reset-password', { email, token, newPassword });
  },
  getDevices() {
    return apiClient.get<any[]>('/user/auth/devices');
  },
  revokeDevice(deviceId: string) {
    return apiClient.delete<{ message: string }>(`/user/auth/devices/${deviceId}`);
  },
};
