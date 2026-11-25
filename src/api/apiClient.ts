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

let refreshInFlight: Promise<void> | null = null;
const notifyAuthExpired = () => {
  window.dispatchEvent(new CustomEvent('app:auth-expired'));
};

const refreshAccessToken = (): Promise<void> => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${API_BASE_URL}/user/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notifyAuthExpired();
        }
        throw new ApiError(response.status, 'Phiên đăng nhập đã hết hạn');
      }
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/')) {
        await refreshAccessToken();
        response = await fetch(url, { ...options, credentials: 'include', headers });
        if (response.status === 401) {
          notifyAuthExpired();
        }
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
