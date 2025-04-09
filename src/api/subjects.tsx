import axios from 'axios';
const base_url = import.meta.env.VITE_BASE_URL;

interface Subject {
  subject_id: number;
  subject_name: string;
  description: string; 
  types: SubjectType[] 
}

interface SubjectType {
  id: number;
  type: string;
}

export interface ApiSubjectType {
  id: number;
  type: string;
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

export const getTypes = async (): Promise<SubjectType[]> => {
  const access_token = localStorage.getItem('access_token');
  
  try {
    const response = await axios.get(`${base_url}/types`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response.data; // Возвращаем только data
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
    console.log('Making request to:', `${base_url}/subjects`);
    const response = await axios.get<Subject[]>(`${base_url}/subjects`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // Таймаут 5 секунд
    });
    return response;
  } catch (error) {
    console.error('Full error details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error config:', error.config);
      console.error('Error response:', error.response);
    }
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