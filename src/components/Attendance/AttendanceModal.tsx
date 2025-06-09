import { useEffect, useState } from 'react';
import { getAttendanceByAttendanceId, updateAttendance, AttendanceRecord, AttendanceModalProps } from '../../api/attendance';

export const AttendanceModal = ({ 
  scheduleId, 
  date, 
  groupName,
  idattendance,
  onClose, 
  onSave 
}: AttendanceModalProps) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [updates, setUpdates] = useState<Record<number, boolean | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Используем новый метод с idattendance
        const data = await getAttendanceByAttendanceId(idattendance);
        setRecords(data);
        
        const initialUpdates = data.reduce((acc, record) => {
          acc[record.iduser] = record.status;
          return acc;
        }, {} as Record<number, boolean | null>);
        
        setUpdates(initialUpdates);
      } catch (error) {
        console.error('Failed to load attendance:', error);
        setError('Не удалось загрузить данные посещаемости');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [idattendance]); // Зависимость от idattendance вместо scheduleId и date

  const handleStatusChange = (userId: number, value: string) => {
    const status = value === 'present' ? true : value === 'absent' ? false : null;
    setUpdates(prev => ({
      ...prev,
      [userId]: status
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // Используем idattendance вместо scheduleId и date
      await updateAttendance(idattendance, updates);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      setError('Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Посещаемость</h2>
        <h3>Группа: {groupName}</h3>
        <h4>Дата: {date}</h4> {/* Display as-is without conversion */}
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <div className="loading">Загрузка данных...</div>
        ) : (
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ФИО</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map(record => (
                    <tr key={record.iduser}>
                      <td>{record.iduser}</td>
                      <td>{record.full_name}</td>
                      <td>
                        <select
                          value={updates[record.iduser] === null ? '' : updates[record.iduser] ? 'present' : 'absent'}
                          onChange={(e) => handleStatusChange(record.iduser, e.target.value)}
                          className="status-select"
                        >
                          <option value="">Не указано</option>
                          <option value="present">Присутствовал</option>
                          <option value="absent">Отсутствовал</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="no-data">Нет данных о студентах</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={onClose}
            disabled={isSaving}
          >
            Отмена
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};