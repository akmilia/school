import axios from "axios";

class UsersApi {
    public static getUsers = async () => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const access_token = localStorage.getItem('token'); // Исправлено с access_token на token

        try {
            const response = await axios.get(`${base_url}/api/users`, { // Добавлен /api
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } 
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    localStorage.clear();
                    window.location.href = '/main';
                }
                throw new Error(error.response?.data?.detail || 'Ошибка получения пользователей');
            }
            throw error;
        }
    }
}
    // public static postUsers = async (formData) => {
    //     const base_url = import.meta.env.VITE_BASE_URL;
    //     const access_token = localStorage.getItem('access_token')

    //     try {
    //         const response = await axios.post(`${base_url}/users`, formData, {
    //             headers: {
    //                 Authorization: 'Bearer ' + access_token,
    //             },
    //         });
    
    //         return response.data;
    //     } 
    //     catch (error) {
    //         return error
    //     }
    // }

    // public static addUser = async (formData) => {
    //     const base_url = import.meta.env.VITE_BASE_URL;
    //     const access_token = localStorage.getItem('access_token')

    //     try {
    //         const response = await axios.post(`${base_url}/users`, formData, {
    //             headers: {
    //                 Authorization: 'Bearer ' + access_token,
    //             },
    //         });
    
    //         return response.data;
    //     } 
    //     catch (error) {
    //         return error
    //     }
    // }

export default UsersApi;