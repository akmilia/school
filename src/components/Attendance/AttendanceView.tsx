import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getAttendanceRecords, 
    updateAttendanceStatus,
    getScheduleDates, 
    ScheduleDate, 
    AttendanceRecord
} from '../../api/attendance';
import './AttendanceView.css';

export const AttendanceView = () => {
    const { idattendance } = useParams();
    const { idschedule } = useParams(); // Добавьте этот параметр
    const navigate = useNavigate();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [dates, setDates] = useState<ScheduleDate[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Загружаем даты для расписания
                if (idschedule) {
                    const datesData = await getScheduleDates(Number(idschedule));
                    setDates(datesData);
                    if (datesData.length > 0) {
                        setSelectedDate(datesData[0].date);
                    }
                }
                
                // Загружаем записи посещаемости
                if (idattendance) {
                    const recordsData = await getAttendanceRecords(Number(idattendance));
                    setRecords(recordsData);
                }
            } catch (err) {
                setError('Не удалось загрузить данные');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idattendance, idschedule]);

    const handleStatusChange = async (iduser: number, newStatus: boolean) => {
        try {
            if (!idattendance) return;
            
            await updateAttendanceStatus(Number(idattendance), iduser, newStatus);
            setRecords(records.map(record => 
                record.iduser === iduser ? { ...record, status: newStatus } : record
            ));
        } catch (err) {
            setError('Не удалось обновить статус');
            console.error(err);
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
            
            {/* Выбор даты */}
            {dates.length > 0 && (
                <div className="date-selector">
                    <label>Дата занятия:</label>
                    <select 
                        value={selectedDate || ''}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        {dates.map(date => (
                            <option key={date.date} value={date.date}>
                                {new Date(date.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            <table className="attendance-table">
                {/* ... (остальная таблица как у вас) */}
            </table>
        </div>
    );
};