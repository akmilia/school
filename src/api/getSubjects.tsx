import axios from 'axios'

export const getSubjects = async () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const access_token = localStorage.getItem('access_token')

    try {
        const response = await axios.get(`${base_url}/subjects`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        return response
    }
    catch (error) {
        return error
    }
}

