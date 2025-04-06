import axios from 'axios'
export const login = async (login: string, password: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/login`, 
            { login, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || 'Ошибка авторизации');
        }
        throw new Error('Неизвестная ошибка');
    }
}