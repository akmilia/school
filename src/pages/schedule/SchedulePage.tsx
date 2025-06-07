import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScheduleDates, getCommonSchedule, ScheduleEntry } from "../../api/schedule";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import "./SchedulePage.css";

const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const SchedulePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const data = await getCommonSchedule();
                setSchedules(data);
            } catch (err) {
                const error = err as Error;
                setError(error.message || 'Ошибка при загрузке расписания');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSchedule();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/main');
    };
     return (
        <div>
            <HeaderAdmin />
            <div className="container">
                <header className="schedule-header">
                    <h1>Общее расписание</h1>
                    <button onClick={handleLogout} className="logout-button">Выйти</button>
                </header>

                {isLoading ? (
                    <div className="loading-message">Загрузка расписания...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="schedule-container">
                        {daysOfWeek.map((day, dayIndex) => {
                            const daySchedule = schedules.filter(
                                item => item.day_of_week.toLowerCase() === day.toLowerCase()
                            );
                            
                            return (
                                <div key={day} className="schedule-day">
                                    <h3>{day}</h3>
                                    {daySchedule.length > 0 ? (
                                        daySchedule
                                            .sort((a, b) => a.time.localeCompare(b.time))
                                            .map((lesson) => (
                                                <div key={lesson.idschedule} className="lesson-info">
                                                    <strong>{lesson.time}</strong>
                                                    <div>{lesson.subject_name}</div>
                                                    <div>Преподаватель: {lesson.teacher.full_name}</div>
                                                    {lesson.group_name && (
                                                        <div>Группа: {lesson.group_name}</div>
                                                    )}
                                                    <div>Кабинет: {lesson.cabinet}</div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="no-classes">Нет занятий</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchedulePage;