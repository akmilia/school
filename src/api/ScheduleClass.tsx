import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;


  interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
  }
  
  interface ApiError {
    message: string;
    status?: number;
    data?: any;
  }
  
  // Общая функция для обработки ошибок
  const handleError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.detail || error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
    return { message: 'Unknown error occurred' };
  };

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

    public static postSchedule = async (formData: any) => {
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

// Получение расписания пользователя
export const fetchUserSchedule = async (userId: number): Promise<ApiResponse<any> | ApiError> => {
    const access_token = localStorage.getItem('access_token');
  
    if (!access_token) {
      return { message: 'No access token found' };
    }
  
    try {
      const response = await axios.get(`${base_url}/api/schedule/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  };
  

export default ScheduleApi;