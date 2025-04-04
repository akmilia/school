import axios from "axios";

export const addSubject = async (newSubject) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const access_token = localStorage.getItem('access_token')

    try {
        const response = await axios.post(`${base_url}/subjects`, {
            id: null, 
            ...newSubject
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        })
        return response
    }
    catch (error) {
        return error
    }
}