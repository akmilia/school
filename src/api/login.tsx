import axios from 'axios'

export const login = async (login: string, password: string) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    try {
        const response = await axios.post(`${base_url}/login`, {
            login,
            password
        })

        return response
    }
    catch (error) {
        return error
    }
}