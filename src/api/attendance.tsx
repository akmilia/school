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
    try {
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
    } catch (error) {
        console.error('Error fetching schedule dates:', error);
        throw error;
    }
};

export const getAttendanceByAttendanceId = async (
  idattendance: number
): Promise<AttendanceRecord[]> => {
  const access_token = localStorage.getItem('access_token');
  const response = await axios.get<AttendanceRecord[]>(
    `${base_url}/api/by-attendance`,
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
    
    // Convert updates to the correct format with numeric keys
    const formattedUpdates: {[key: string]: boolean | null} = {};
    Object.keys(updates).forEach(key => {
        formattedUpdates[key] = updates[parseInt(key)];
    });

    try {
        await axios.post(
            `${base_url}/api/update`, 
            { 
                idattendance, 
                updates: formattedUpdates
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
    }
};