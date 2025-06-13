import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  role: string;
  user_id: number;
  expires_at: string; // ISO string даты истечения
  expires_in: number; // секунды до истечения
}

interface User {
  id: number;
  role: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}

interface AuthContextType {
  user: User | null;
  login: (tokenData: TokenResponse) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  refreshToken: async () => {},
  isInitialized: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Инициализация при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        const role = localStorage.getItem('user_role');
        const userId = localStorage.getItem('user_id');
        const expires_at = localStorage.getItem('expires_at');

        if (access_token && refresh_token && role && userId && expires_at) {
          const expiresAt = new Date(expires_at);
          
          // Если токен не истек или мы сможем его обновить
          if (expiresAt > new Date()) {
            setUser({
              id: Number(userId),
              role,
              access_token,
              refresh_token,
              expires_at: expiresAt
            });
          } else {
            await refreshToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (tokenData: TokenResponse) => {
    const expires_at = new Date(tokenData.expires_at);
    const userData: User = {
      id: tokenData.user_id,
      role: tokenData.role,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at
    };
    
    setUser(userData);
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('user_role', tokenData.role);
    localStorage.setItem('user_id', tokenData.user_id.toString());
    localStorage.setItem('expires_at', expires_at.toISOString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');

    window.location.href = '/main';
  };

  const refreshToken = async (): Promise<void> => {
    if (isRefreshing || !user?.refresh_token) return;
    
    setIsRefreshing(true);
    try {
      const response = await axios.post<TokenResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/refresh`,
        { refresh_token: user.refresh_token }
      );
      login(response.data);
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Настройка интерсепторов axios
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (user?.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
          
          // Обновляем токен если до истечения меньше 1 минуты
          if (user.expires_at.getTime() - Date.now() < 60000) {
            await refreshToken();
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await refreshToken();
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
