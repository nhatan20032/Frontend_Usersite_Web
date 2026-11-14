const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;
  isUpgradeRequired: boolean;
  isGuest: boolean;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.isUpgradeRequired = data?.errorCode === 'UPGRADE_REQUIRED';
    this.isGuest = Boolean(data?.isGuest);
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('refresh_token', token);
  } else {
    localStorage.removeItem('refresh_token');
  }
};

const isPublicEndpoint = (endpoint: string): boolean => {
  const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return (
    ep.startsWith('/user/auth/login') ||
    ep.startsWith('/user/auth/register') ||
    ep.startsWith('/user/auth/forgot-password') ||
    ep.startsWith('/user/auth/reset-password') ||
    ep.startsWith('/user/auth/refresh-token') ||
    ep.startsWith('/payments/webhook') ||
    ep.startsWith('/user/subscriptions/plans') ||
    ep.startsWith('/user/routines/templates') ||
    ep.startsWith('/user/appointments/public/') ||
    ep.startsWith('/pricing')
  );
};

let refreshInFlight: Promise<string> | null = null;
const refreshAccessToken = (): Promise<string> => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new ApiError(401, 'Phiên đăng nhập đã hết hạn');
      const response = await fetch(`${API_BASE_URL}/user/auth/refresh-token`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        if (response.status === 401) { setAuthToken(null); setRefreshToken(null); }
        throw new ApiError(response.status, 'Không thể làm mới phiên đăng nhập');
      }
      const data = await response.json();
      if (!data.token) throw new ApiError(401, 'Thiếu access token');
      setAuthToken(data.token); if (data.refreshToken) setRefreshToken(data.refreshToken);
      return data.token;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();

    // Guard: Prevent unauthenticated guest requests from triggering 401 network errors
    if (!isPublicEndpoint(endpoint) && !token) {
      throw new ApiError(401, 'Chưa đăng nhập (Guest Mode)', { isGuest: true });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/')) {
        headers.Authorization = `Bearer ${await refreshAccessToken()}`;
        response = await fetch(url, { ...options, headers });
      }

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        if (errorData?.errorCode === 'UPGRADE_REQUIRED') {
          // Dispatch custom event for UI to pop Upgrade Modal automatically
          window.dispatchEvent(new CustomEvent('app:upgrade-required', { detail: errorData }));
        }

        throw new ApiError(
          response.status,
          errorData.message || `Request failed with status ${response.status}`,
          errorData
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, err.message || 'Lỗi kết nối mạng hoặc máy chủ không phản hồi.');
    }
  },

  get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) query.append(key, String(val));
      });
      const queryString = query.toString();
      if (queryString) url += `?${queryString}`;
    }
    return apiClient.request<T>(url, { method: 'GET' });
  },

  post<T>(endpoint: string, body?: any): Promise<T> {
    return apiClient.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any): Promise<T> {
    return apiClient.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any): Promise<T> {
    return apiClient.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return apiClient.request<T>(endpoint, { method: 'DELETE' });
  },
};
