import axios from 'axios';
const base_url = import.meta.env.VITE_BASE_URL;

interface Subject {
  subject_id: number;
  subject_name: string;
  description: string; 
  types: SubjectType[] 
}
 
interface Group { 
  idgroups: number;
  name: string;
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

export interface ApiGroup { 
  idgroups: number;
  name: string
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
    const response = await axios.get(`${base_url}/api/types`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return response.data; // Возвращаем только data
  } catch (error) {
    throw new Error('Failed to fetch types');
  }
};  


export const getGroups = async (): Promise<ApiResponse<ApiGroup[]> | ApiError> => {
  const access_token = localStorage.getItem('access_token');

  if (!access_token) {
    return { message: 'No access token found' };
  }

  try {
    console.log('Making request to:', `${base_url}/groups`);
    
    const response = await axios.get<ApiGroup[]>(`${base_url}/api/groups`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // Таймаут на запрос — 5 секунд
    });

    console.log('Response received:', response.data);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Full error details:', error);

    if (axios.isAxiosError(error)) {
      console.error('Error config:', error.config);
      console.error('Error response:', error.response);

      return {
        message: error.response?.data?.message || 'Failed to fetch groups',
        status: error.response?.status,
        data: error.response?.data
      };
    }

    return { message: 'An unexpected error occurred' };
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
    const response = await axios.get<Subject[]>(`${base_url}/api/subjects`, {
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

export const handleEnrollGroup = async (idgroups: number) => {
  const access_token = localStorage.getItem('access_token');
  
  if (!access_token) {
    throw new Error('Требуется авторизация');
  }

  try {
    const response = await axios.post(
      `${base_url}/api//enroll/group`,
      { idgroups }, // Отправляем как объект с полем group_id
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Очищаем невалидный токен
        localStorage.removeItem('access_token');
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
      }
      throw new Error(error.response?.data?.detail || 'Ошибка сервера');
    }
    throw new Error('Неизвестная ошибка');
  }
}; 
