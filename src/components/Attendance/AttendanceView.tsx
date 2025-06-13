import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getAttendanceByAttendanceId, 
    updateAttendance,
    getScheduleDates, 
    ScheduleDate, 
    AttendanceRecord
} from '../../api/attendance';
import './AttendanceView.css';

export const AttendanceView = () => {
    const { idschedule } = useParams();
    const navigate = useNavigate();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [dates, setDates] = useState<ScheduleDate[]>([]);
    const [selectedAttendance, setSelectedAttendance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [changesMade, setChangesMade] = useState(false);
    const [updates, setUpdates] = useState<Record<number, boolean | null>>({});
    const [isStudentView, setIsStudentView] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (idschedule) {
                    // Load dates for the schedule
                    const datesData = await getScheduleDates(Number(idschedule));
                    setDates(datesData);
                    
                    // Select first date by default
                    if (datesData.length > 0) {
                        setSelectedAttendance(datesData[0].idattendance);
                    }
                }
            } catch (err) {
                setError('Не удалось загрузить данные о датах');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idschedule]);
    
    useEffect(() => {
        const loadAttendanceRecords = async () => {
            if (!selectedAttendance) return;
            
            try {
                setLoading(true);
                const recordsData = await getAttendanceByAttendanceId(selectedAttendance);
                setRecords(recordsData);
                
                // Initialize updates with current statuses
                const initialUpdates = recordsData.reduce((acc, record) => {
                    acc[record.iduser] = record.status;
                    return acc;
                }, {} as Record<number, boolean | null>);
                
                setUpdates(initialUpdates);
            } catch (err) {
                setError('Не удалось загрузить данные о посещаемости');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadAttendanceRecords();
    }, [selectedAttendance]); 

    useEffect(() => {
    const role = localStorage.getItem('user_role');
    setIsStudentView(role === 'Ученик');
}, []);

    const handleStatusChange = (iduser: number, status: boolean) => {
        setUpdates(prev => ({
            ...prev,
            [iduser]: status
        }));
        setChangesMade(true);
    };

    const handleSave = async () => {
        if (!selectedAttendance || !changesMade) return;
        
        try {
            setLoading(true);
            await updateAttendance(selectedAttendance, updates);
            setChangesMade(false);
            
            // Refresh data after save
            const recordsData = await getAttendanceByAttendanceId(selectedAttendance);
            setRecords(recordsData);
        } catch (err) {
            setError('Не удалось сохранить изменения');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="attendance-container">
            <h2>Посещаемость занятия</h2>
            <button onClick={() => navigate(-1)} className="back-button">
                Назад к расписанию
            </button>
            
            {/* Date selector */}
            {dates.length > 0 && (
                <div className="date-selector">
                    <label>Дата занятия:</label>
                    <select 
                        value={selectedAttendance || ''}
                        onChange={(e) => setSelectedAttendance(Number(e.target.value))}
                    >
                        {dates.map(date => (
                            <option key={date.idattendance} value={date.idattendance}>
                                {new Date(date.date).toLocaleDateString('ru-RU')}
                                {date.attendance_status !== null && (
                                    <span className={`status-indicator ${
                                        date.attendance_status ? 'present' : 'absent'
                                    }`}>
                                        {date.attendance_status ? ' ✓' : ' ✗'}
                                    </span>
                                )}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            {/* Attendance table */}
            <table className="attendance-table">
    <thead>
        <tr>
            <th>№</th>
            <th>ФИО</th>
            <th>Статус</th>
            {!isStudentView && <th>Действия</th>}
        </tr>
    </thead>
    <tbody>
        {records.length > 0 ? (
            records.map((record, index) => (
                <tr key={record.iduser}>
                    <td>{index + 1}</td>
                    <td>{record.full_name}</td>
                    <td>
                        <span className={`status ${
                            updates[record.iduser] === true ? 'present' :
                            updates[record.iduser] === false ? 'absent' : 'unknown'
                        }`}>
                            {updates[record.iduser] === true ? 'Присутствовал' :
                             updates[record.iduser] === false ? 'Отсутствовал' : 'Не отмечен'}
                        </span>
                    </td>
                    {!isStudentView && (
                        <td className="action-buttons">
                            <button
                                className={`present ${updates[record.iduser] === true ? 'active' : ''}`}
                                onClick={() => handleStatusChange(record.iduser, true)}
                            >
                                Присутствовал
                            </button>
                            <button
                                className={`absent ${updates[record.iduser] === false ? 'active' : ''}`}
                                onClick={() => handleStatusChange(record.iduser, false)}
                            >
                                Отсутствовал
                            </button>
                        </td>
                    )}
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={isStudentView ? 3 : 4} className="no-data">
                    Нет данных о студентах
                </td>
            </tr>
        )}
    </tbody>
</table>

            {/* Save button */}
            {changesMade && (
                <div className="save-container">
                    <button 
                        className="save-button"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            )}
        </div>
    );
};