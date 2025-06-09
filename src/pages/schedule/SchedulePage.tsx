import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getCommonSchedule, 
    getPersonalSchedule, 
    ScheduleEntry,
    PersonalScheduleEntry 
} from "../../api/schedule";
import { getScheduleDates, ScheduleDate, updateAttendance, AttendanceModalProps } from "../../api/attendance"; 
import { AttendanceModal} from "../../components/Attendance/AttendanceModal";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import "./SchedulePage.css";

const daysOfWeek: string[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const SchedulePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commonSchedules, setCommonSchedules] = useState<ScheduleEntry[]>([]);
    const [personalSchedules, setPersonalSchedules] = useState<PersonalScheduleEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'common' | 'personal'>('common');
    const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
    const [attendanceDates, setAttendanceDates] = useState<ScheduleDate[]>([]); 
    const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({}); 
    const [modalData, setModalData] = useState<{
    date: string;
    groupName: string;
    idattendance: number; // Добавляем idattendance
} | null>(null);
    const navigate = useNavigate();

    const currentDayOfWeek = new Date().getDay() - 1;
    const currentDayName = daysOfWeek[currentDayOfWeek >= 0 ? currentDayOfWeek : 6];

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const [commonData, personalData] = await Promise.all([
                    getCommonSchedule(),
                    getPersonalSchedule()
                ]);
                
                setCommonSchedules(commonData);
                setPersonalSchedules(personalData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        loadSchedules();
    }, []);

    const handleScheduleClick = async (scheduleId: number) => {
        try {
            setSelectedSchedule(scheduleId);
            const dates = await getScheduleDates(scheduleId);
            setAttendanceDates(dates);
        } catch (error) {
            console.error("Failed to fetch attendance dates:", error);
            setAttendanceDates([]);
        }
    };  

    const handleDateClick = (dateItem: ScheduleDate, groupName: string) => {
    setModalData({ 
        date: dateItem.date, 
        groupName,
        idattendance: dateItem.idattendance // Добавляем idattendance
    });
    };
    
    const handleSaveAttendance = async (updates: Record<number, boolean | null>) => {
    if (!modalData) return;
    
    try {
        await updateAttendance(modalData.idattendance, updates);
        // Обновляем данные после сохранения
        const dates = await getScheduleDates(selectedSchedule!);
        setAttendanceDates(dates);
    } catch (error) {
        console.error('Failed to save attendance:', error);
    }
    }; 

    const getDaySchedule = (dayName: string, schedules: (ScheduleEntry | PersonalScheduleEntry)[]) => {
        return schedules
            .filter(item => item.day_of_week.toLowerCase() === dayName.toLowerCase())
            .sort((a, b) => a.time.localeCompare(b.time));
    };


const toggleLesson = (scheduleId: number) => {
  setExpandedLessons(prev => ({
    ...prev,
    [scheduleId]: !prev[scheduleId]
  }));
  
  if (!expandedLessons[scheduleId]) {
    handleScheduleClick(scheduleId);
  }
};
const renderSchedule = (schedules: (ScheduleEntry | PersonalScheduleEntry)[], isPersonal: boolean) => {
  return (
    <div className="schedule-container">
      {daysOfWeek.map((day: string) => {
        const dayLessons = getDaySchedule(day, schedules);
        return (
          <div className={`schedule-day ${day === currentDayName ? 'current-day' : ''}`} key={day}>
            <h3>{day}</h3>
            {dayLessons.length > 0 ? (
              dayLessons.map(lesson => (
                isPersonal ? (
                  // Персональное расписание с аккордеоном
                  <div key={lesson.idschedule} className="lesson-container">
                    <div 
                      className="lesson-header"
                      onClick={() => toggleLesson(lesson.idschedule)}
                    >
                      <div className="lesson-time">{lesson.time}</div>
                      <div className="lesson-subject">{lesson.subject_name}</div>
                      <div className="lesson-toggle">
                        {expandedLessons[lesson.idschedule] ? '▲' : '▼'}
                      </div>
                    </div>
                    
                    {expandedLessons[lesson.idschedule] && (
                      <div className="lesson-details">
                        <div>Преподаватель: {lesson.teacher}</div>
                        <div>Группа: {lesson.group_nam}</div>
                        <div>Кабинет: {lesson.cabinet}</div>
                        
                        <div className="attendance-dates">
                          <h4>Даты посещаемости:</h4>
                        {attendanceDates.length > 0 ? (
                            <ul className="dates-list">
                              {attendanceDates.map(dateItem => (
                                    <li 
                                        key={dateItem.date} 
                                        className="clickable-date"
                                        onClick={() => handleDateClick(dateItem, lesson.group_nam)}
                                    >
                                        {dateItem.date} {/* Display as-is without conversion */}
                                        {dateItem.attendance_status !== null && (
                                            <span className={`status ${dateItem.attendance_status ? 'present' : 'absent'}`}>
                                                {dateItem.attendance_status ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            ) : (
                            <div className="no-dates">Нет данных о посещаемости</div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Общее расписание в простых карточках
                  <div key={lesson.idschedule} className="lesson-info">
                    <strong>{lesson.time}</strong>
                    <div>{lesson.subject_name}</div>
                    <div>Преподаватель: {lesson.teacher}</div>
                    <div>Группа: {lesson.group_nam}</div>
                    <div>Кабинет: {lesson.cabinet}</div>
                  </div>
                )
              ))
            ) : (
              <div className="no-classes">Нет занятий</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

    return (
        <div>
            <HeaderAdmin />
            <div className="container">
                <h1>Расписание</h1>
                
                <div className="schedule-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'common' ? 'active' : ''}`}
                        onClick={() => setActiveTab('common')}
                    >
                        Общее расписание
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Мое расписание
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="loading-message">Загрузка расписания...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        {activeTab === 'common' 
                        ? renderSchedule(commonSchedules, false)
                        : renderSchedule(personalSchedules, true)}
                    </>
                )} 
                 {modalData && (
                    <AttendanceModal
                        scheduleId={selectedSchedule!}
                        date={modalData.date}
                        groupName={modalData.groupName}
                        idattendance={modalData.idattendance}
                        onClose={() => setModalData(null)}
                        onSave={() => {
                            handleScheduleClick(selectedSchedule!);
                        }}
                    />
                )}
            </div>
        </div>
    );
};