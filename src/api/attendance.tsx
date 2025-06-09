import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

export interface AttendanceRecord {
  iduser: number;
  full_name: string;
  status: boolean | null; // Present/Absent/Not marked
}

export interface ScheduleDate {
  idattendance: number; // Essential for API calls
  date: string; // "YYYY-MM-DD" format
  attendance_status: boolean | null; // User's status if available
}

// AttendanceModal.tsx props
export interface AttendanceModalProps {
  scheduleId: number; // For reference
  date: string; // Display only
  groupName: string; // Display only
  idattendance: number; // Key for API operations
  onClose: () => void;
  onSave: () => void;
}
export const getScheduleDates = async (scheduleId: number): Promise<ScheduleDate[]> => {
    const access_token = localStorage.getItem('access_token');
    const response = await axios.get<ScheduleDate[]>(
        `${base_url}/api/schedule/${scheduleId}/dates`,
        {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

export const getAttendanceRecords = async (idattendance: number): Promise<AttendanceRecord[]> => {
  const access_token = localStorage.getItem('access_token');
  const response = await axios.get<AttendanceRecord[]>(
    `${base_url}/api/attendance/${idattendance}/records`,
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Новый метод для получения записей посещаемости по idattendance
export const getAttendanceByAttendanceId = async (
  idattendance: number
): Promise<AttendanceRecord[]> => {
  const access_token = localStorage.getItem('access_token');
  const response = await axios.get<AttendanceRecord[]>(
    `${base_url}/api/attendance/by-attendance`,
    {
      params: { attendance_id: idattendance },
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const updateAttendance = async (
    idattendance: number,
    updates: Record<number, boolean | null>
): Promise<void> => {
    const access_token = localStorage.getItem('access_token');
    await axios.post(
        `${base_url}/api/attendance/update`,
        {
            idattendance,
            updates
        },
        {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        }
    );
};
export const updateAttendanceStatus = async (
  idattendance: number,
  iduser: number,
  status: boolean
): Promise<void> => {
  const access_token = localStorage.getItem('access_token');
  await axios.post(
    `${base_url}/api/attendance/${idattendance}/status`,
    { iduser, status },
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}; 
