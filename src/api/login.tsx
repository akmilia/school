import axios from 'axios'  

interface LoginResponse {
    access_token: string;
    role: string; 
    token_type: string;
    user_id: number;
} 

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