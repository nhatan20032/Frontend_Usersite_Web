import { apiClient } from './apiClient';
export interface RemoteTheme { id: string; code: string; name: string; primaryColor: string; backgroundColor: string; isLocked: boolean; palette?: { primaryColor?: string; backgroundColor?: string; textColor?: string; surfaceColor?: string; backgroundAssetId?: string }; }
export interface Preferences { currentTheme: string; language: 'vi' | 'en'; enableSound: boolean; availableThemes: RemoteTheme[]; }
export const settingsApi = {
  get: () => apiClient.get<Preferences>('/user/settings'),
  save: (data: { themeCode?: string; language?: 'vi' | 'en'; enableSound?: boolean }) => apiClient.put<Preferences>('/user/settings', data),
};
export const assetUrl = (path: string) => new URL(path, import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').href;
