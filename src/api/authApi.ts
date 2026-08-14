import { apiClient } from './apiClient';

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    subscriptionTier: 'FREE' | 'BASIC' | 'PRO' | 'VIP';
    isPremium: boolean;
    planName?: string;
    planExpiresAt?: string;
    features: string[];
  };
}

export const authApi = {
  register(data: RegisterDto) {
    return apiClient.post<AuthResponse>('/user/auth/register', data);
  },
  login(data: LoginDto) {
    return apiClient.post<AuthResponse>('/user/auth/login', data);
  },
  getProfile() {
    return apiClient.get<AuthResponse['user']>('/user/auth/me');
  },
};
