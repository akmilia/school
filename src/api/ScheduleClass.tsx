import axios from "axios";

class ScheduleApi {
    public static getSchedule = async () => {
        const base_url = import.meta.env.VITE_BASE_URL;
        try {
            const response = await axios.get(`${base_url}/schedule`);
    
            return response.data;
        } 
        catch (error) {
            return error
        }
    }

    public static postSchedule = async (formData) => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const access_token = localStorage.getItem('access_token')

        try {
            const response = await axios.post(`${base_url}/schedule`, formData, {
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
}

export default ScheduleApi;