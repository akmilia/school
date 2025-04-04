import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderAdmin from "../../components/HeaderAdmin/Header"; 
import "./SchedulePage.css";

interface ScheduleItem {
  day_of_week: number;
  time: string;
  subject_name: string;
  group_name?: string;
  teacher_name?: string;
  cabinet: string;
}

const SchedulePage = () => {
  const baseUrl = import.meta.env.VITE_baseUrl;
  const user_role = localStorage.getItem("user_role");
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/api/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(response.data);
      } catch (err) {
        setError('Ошибка при загрузке расписания');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [baseUrl]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    navigate('/main');
  };

  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <div>
      <HeaderAdmin />
      <div className="container">
        <h3>Ваше расписание</h3>

        <div className="schedule-container">
          <header>
            <h1>
              {user_role === '3' ? 'Мое расписание' : 
               user_role === '2' ? 'Мое преподавательское расписание' : 
               'Расписание'}
            </h1>
            <button onClick={handleLogout} className="logout-button">Выйти</button>
          </header>

          {isLoading ? (
            <div>Загрузка расписания...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="schedule-grid">
              {daysOfWeek.map((day, index) => {
                const daySchedule = schedules.filter(item => item.day_of_week === index + 1);
                
                return (
                  <div key={day} className="day-column">
                    <h3>{day}</h3>
                    {daySchedule.length > 0 ? (
                      daySchedule.map((lesson, idx) => (
                        <div key={`${day}-${idx}`} className="schedule-item">
                          <div className="time">{lesson.time}</div>
                          <div className="subject">{lesson.subject_name}</div>
                          {user_role === '2' && lesson.group_name && (
                            <div className="group">Группа: {lesson.group_name}</div>
                          )}
                          {user_role === '3' && lesson.teacher_name && (
                            <div className="teacher">Преподаватель: {lesson.teacher_name}</div>
                          )}
                          <div className="cabinet">Каб. {lesson.cabinet}</div>
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
    </div>
  );
};

export default SchedulePage;