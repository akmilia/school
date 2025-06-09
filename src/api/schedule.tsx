import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

export interface ScheduleEntry {
    idschedule: number;
    time: string;
    subject_name: string;
    teacher: string;
    cabinet: string;
    group_nam: string;
    day_of_week: string;
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
export interface PersonalScheduleEntry extends ScheduleEntry {
    teacher_id: number;
    group_id: number;
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
            throw new Error('Authentication required');
        }

        const response = await axios.get<ScheduleEntry[]>(`${base_url}/api/common_schedule`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (!response.data) {
            throw new Error('No data received');
        }

        return response.data.map(item => ({
            ...item,
            // Дополнительная обработка если нужно
        }));
    } catch (error) {
        console.error('Failed to fetch schedule:', error);
        throw new Error(
            axios.isAxiosError(error) 
                ? error.response?.data?.detail || error.message
                : 'Failed to load schedule'
        );
    }
};


export const getPersonalSchedule = async (): Promise<PersonalScheduleEntry[]> => {
    try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            throw new Error('Authentication required');
        }

        const response = await axios.get<PersonalScheduleEntry[]>(`${base_url}/api/personal_schedule`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (!response.data) {
            throw new Error('No data received');
        }

        return response.data;
    } catch (error) {
        console.error('Failed to fetch personal schedule:', error);
        throw new Error(
            axios.isAxiosError(error) 
                ? error.response?.data?.detail || error.message
                : 'Failed to load personal schedule'
        );
    }
};