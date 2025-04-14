import axios from 'axios'  
import { AuthContext } from '../context/AuthContext';

interface LoginResponse {
    access_token: string;
    role: string; 
    token_type: string;
    user_id: number;
} 

// Автоматическое обновление токена при 401 ошибке
axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status === 401) {
        await refreshToken();
        return axios(error.config);
      }
      return Promise.reject(error);
    }
  );
  

export const login = async (login: string, password: string): Promise<{ data: LoginResponse }> => {
    try {
        const response = await axios.post<LoginResponse>(
            `${import.meta.env.VITE_BASE_URL}/login`, 
            { login, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || 'Ошибка авторизации');
        }
        throw new Error('Неизвестная ошибка');
    }
};