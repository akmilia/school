import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

export interface ScheduleTeacher {
    full_name: string;
}

export interface ScheduleEntry {
    idschedule: number;
    time: string; // Формат "HH:MM"
    subject_name: string;
    teacher: ScheduleTeacher;
    cabinet: string;
    group_name?: string;
    day_of_week: string;
    dates?: string[]; // Опционально для дат занятий
}

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

const handleError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
        return {
            message: error.response?.data?.detail || error.message,
            status: error.response?.status,
            data: error.response?.data
        };
    }
    return { message: 'Unknown error occurred' };
}; 

export const getCommonSchedule = async (): Promise<ScheduleEntry[]> => {
    try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            throw new Error('No access token found');
        }

        const response = await axios.get<ScheduleEntry[]>(
            `${base_url}/api/common_schedule`,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        throw handleError(error);
    }
};

export const getScheduleDates = async (scheduleId: number): Promise<string[]> => {
    try {
        const access_token = localStorage.getItem('access_token');
        const response = await axios.get<string[]>(
            `${base_url}/api/schedule/${scheduleId}/dates`,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule dates:", error);
        throw handleError(error);
    }
};
    
// Получение расписания пользователя
export const getUserSchedule = async (userId: number): Promise<ApiResponse<any> | ApiError> => {
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
  
