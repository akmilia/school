import axios from 'axios';
import { TokenResponse } from '../context/AuthContext';

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

interface UserResponseSchemaBithdate {
  idusers: number;
  full_name: string;
  login: string;
  birthdate: Date;
  id_roles: number;
  user_role: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Add this for cookie-based auth
});

/**
 * Сервис для работы с аутентификацией
 */
export const authService = {
  async login(login: string, password: string): Promise<TokenResponse> {
    try {
      const response = await api.post<TokenResponse>('/api/login', { 
        login, 
        password 
      }); 
      return {
        ...response.data,
        expires_at: response.data.expires_at // Убедимся, что expires_at передается
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.detail || 'Ошибка авторизации',
          status: error.response?.status,
          details: error.response?.data,
        } as ApiError;
      }
      throw {
        message: 'Неизвестная ошибка',
        details: error,
      } as ApiError;
    }
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await api.post<TokenResponse>('/api/refresh', { 
        refresh_token: refreshToken 
      });
      return {
        ...response.data,
        expires_at: response.data.expires_at
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.detail || 'Ошибка обновления токена',
          status: error.response?.status,
          details: error.response?.data,
        } as ApiError;
      }
      throw {
        message: 'Неизвестная ошибка',
        details: error,
      } as ApiError;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.warn('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<UserResponseSchemaBithdate> {
    try {
      const response = await api.get('/api/current-user');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.detail || 'Ошибка получения профиля',
          status: error.response?.status,
          details: error.response?.data,
        } as ApiError;
      }
      throw {
        message: 'Неизвестная ошибка',
        details: error,
      } as ApiError;
    }
  },

  async getUserCourses(): Promise<string[]> {
    try {
      const response = await api.get('/api/user-courses');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.detail || 'Ошибка получения курсов',
          status: error.response?.status,
          details: error.response?.data,
        } as ApiError;
      }
      throw {
        message: 'Неизвестная ошибка',
        details: error,
      } as ApiError;
    }
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log('Attaching token to request'); 
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для обработки 401 ошибки
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const tokenData = await authService.refresh(refreshToken);
        
        localStorage.setItem('access_token', tokenData.access_token);
        localStorage.setItem('refresh_token', tokenData.refresh_token);
        localStorage.setItem('expires_at', tokenData.expires_at);

        originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;