import axios from 'axios';
const base_url = import.meta.env.VITE_BASE_URL;

// Типы для TypeScript
interface Subject {
  id: number;
  name: string;
  description: string;
  id_type: number;
  type?: string; // Опционально, если приходит с сервера
}

interface Type {
  id: number;
  name: string;
  description?: string;
}

export interface ApiSubjectType {
  type_id: number;
  type_name: string;
}

export interface ApiSubject {
  subject_id: number;
  subject_name: string;
  description: string;
  types: ApiSubjectType[];
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

export const getTypes = async (): Promise<{ data: Type[] }> => {
  const access_token = localStorage.getItem('access_token');
  
  try {
    const response = await axios.get(`${base_url}/types`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch types');
  }
};
// Получение предметов
export const getSubjects = async (): Promise<ApiResponse<Subject[]> | ApiError> => {
  const access_token = localStorage.getItem('access_token');
  
  if (!access_token) {
    return { message: 'No access token found' };
  }

  try {
    const response = await axios.get<Subject[]>(`${base_url}/subjects`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

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

// Запись на предмет
export const enrollToSubject = async (
  userId: number, 
  subjectId: number
): Promise<ApiResponse<any> | ApiError> => {
  const access_token = localStorage.getItem('access_token');

  if (!access_token) {
    return { message: 'No access token found' };
  }

  try {
    const response = await axios.post(
      `${base_url}/api/schedule/enroll`,
      { userId, subjectId },
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};