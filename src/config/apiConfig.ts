/**
 * Cấu hình tập trung cho API và các kết nối dịch vụ Backend của Usersite Web.
 * Khi cần thay đổi Base URL hoặc đường dẫn kết nối, chỉ cần chỉnh sửa tại file này hoặc qua biến môi trường (.env).
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Base URL chính của API (ví dụ: http://localhost:5000/api/v1)
 */
export const API_BASE_URL: string = RAW_API_URL.replace(/\/+$/, '');

/**
 * Host gốc của Backend (ví dụ: http://localhost:5000, không chứa /api/v1)
 * Dùng cho các dịch vụ kết nối socket, SignalR hubs, assets,...
 */
export const BACKEND_BASE_URL: string = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * URL kết nối SignalR Sync Hub
 */
export const SYNC_HUB_URL: string = `${BACKEND_BASE_URL}/hubs/sync`;

/**
 * Helper tạo URL tuyệt đối cho tài nguyên từ Backend
 */
export const getAssetUrl = (path: string): string => {
  return new URL(path.startsWith('/') ? path : `/${path}`, API_BASE_URL).href;
};
