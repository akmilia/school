import axios from "axios";

class UsersApi {
    public static getUsers = async () => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const access_token = localStorage.getItem('access_token')

        try {
            const response = await axios.get(`${base_url}/users`, {
                headers: {
                    Authorization: 'Bearer ' + access_token,
                },
            });
    
            return response.data;
        } 
        catch (error) {
            return error
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
}

export default UsersApi;