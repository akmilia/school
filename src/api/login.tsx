import axios from 'axios'

export const login = async (login: string, password: string) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    try {
        const response = await axios.post(`${base_url}/auth/login`, {
            // Полный путь http://localhost:5555/v1/auth/login
            login,
            password
        })

        return response.data
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || 'Ошибка авторизации');
        }
        throw new Error('Неизвестная ошибка');
    }
}