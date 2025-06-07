import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

class UsersApi {
    public static getTeachers = async () => { 
        
        const access_token = localStorage.getItem('access_token');
        
        if (!access_token) {
            // localStorage.clear();
            // window.location.href = '/login';
            return [];
          }

        try {
            const response = await axios.get(`${base_url}/api/teachers`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    localStorage.clear();
                    window.location.href = '/main';
                }
                throw new Error(error.response?.data?.detail || 'Ошибка получения преподавателей');
            }
            throw error;
        }
    }
}

export default UsersApi;
