import HeaderAdmin from "../../components/HeaderAdmin/Header"; 
import { useEffect, useState } from "react";
import AddScheduleModal from "../../components/Schedule/SheduleModal";
import axios from "axios";
import CheduleApi from "../../api/ScheduleClass";
import "./SchedulePage.css";

const SchedulePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const access_token = localStorage.getItem("access_token");
    const user_role = localStorage.getItem("user_role");

    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState({}); // Аккордеон

    const [filteredType, setFilteredType] = useState<string | null>(null); // Состояние для фильтра типа предмета
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Состояние для открытия выпадающего фильтра

    const getSubjects = async () => {
        try {
            const response = await axios.get(`${baseUrl}/subjects`, {
                headers: { Authorization: "Bearer " + access_token },
            });
            setSubjects(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке предметов:", error);
        }
    };

    const getTeachers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/teachers`, {
                headers: { Authorization: "Bearer " + access_token },
            });
            setTeachers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSchedule = async () => {
        try {
            const response = await axios.get(`${baseUrl}/schedule`, {
                headers: { Authorization: "Bearer " + access_token },
            });
            setSchedules(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSchedule = (data) => {
        CheduleApi.postSchedule(data);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hoursUTC3 = (date.getUTCHours() + 6) % 24;
        const formattedHours = String(hoursUTC3).padStart(2, "0");
        const formattedMinutes = String(date.getUTCMinutes()).padStart(2, "0");
        return `${formattedHours}:${formattedMinutes}`;
    };

    const formatTeacherName = (teacher) => {
        return `${teacher.surname} ${teacher.name[0]}.${teacher.paternity[0]}.`;
    };

    const formatType = (type) => {
        switch (type) {
            case "sport":
                return "Спорт";
            case "art":
                return "Искусство";
            case "free":
                return "Бесплатно";
            default:
                return "Платно";
        }
    };

    const groupScheduleByDay = () => {
        const grouped = {};
        schedules.forEach((day) => {
            const dayName = day.day_name;
            if (!grouped[dayName]) {
                grouped[dayName] = {};
            }
            day.schedules.forEach((lesson) => {
                const subjectId = lesson.subject.id;
                if (!grouped[dayName][subjectId]) {
                    grouped[dayName][subjectId] = {
                        lessonInfo: lesson,
                        dates: [],
                    };
                }
                grouped[dayName][subjectId].dates.push(lesson.date_n_time);
            });
        });
        return grouped;
    };

    const groupDatesByMonth = (dates) => {
        const grouped = {};
        dates.forEach((dateString) => {
            const date = new Date(dateString);
            const month = date.toLocaleString("ru-RU", { month: "long" });
            if (!grouped[month]) {
                grouped[month] = [];
            }
            grouped[month].push(date.getDate());
        });
        return grouped;
    };

    const formatDateList = (dates) => {
        const groupedByMonth = groupDatesByMonth(dates);
        return Object.entries(groupedByMonth).map(([month, days]) => (
            <div key={month} className="month-group">
                <strong>{month}:</strong> {days.join(", ")}
            </div>
        ));
    };

    const toggleAccordion = (subjectId, dayName) => {
        const key = `${subjectId}-${dayName}`;
        setExpandedSubjects((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Фильтрация расписания по типу предмета
    const filteredSchedules = filteredType === null 
        ? schedules 
        : schedules.filter((schedule) => {
            return schedule.schedules.some((lesson) => {
                return lesson.subject.type === filteredType;
            });
        });

    useEffect(() => {
        getTeachers();
        getSchedule();
        getSubjects();
    }, []);

    return (
        <div>
            <HeaderAdmin />
            <div className="container">
                {user_role === "admin" && (
                    <button onClick={() => setIsModalOpen(true)}>Добавить</button>
                )}
                <h3>Наши занятия и курсы</h3>

                {/* Кнопка и фильтр по типу предмета */}
                <div className="filter-container">
                    <button onClick={() => setIsFilterOpen(prev => !prev)}>
                        Фильтр по типу
                    </button>
                    {isFilterOpen && (
                        <div className="filter-dropdown">
                            <select
                                onChange={(e) => {
                                    const selectedType = e.target.value || null;
                                    setFilteredType(selectedType);
                                }}
                                value={filteredType || ''}
                            >
                                <option value="">Все типы</option>
                                <option value="sport">Спорт</option>
                                <option value="art">Искусство</option>
                                <option value="free">Бесплатно</option>
                                <option value="paid">Платно</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="schedule-container">
                    {Object.entries(groupScheduleByDay()).map(([dayName, subjects]) => (
                        <div key={dayName} className="schedule-day">
                            <h4>{dayName}</h4>
                            {Object.values(subjects).map(({ lessonInfo, dates }) => {
                                // Применяем фильтрацию на уровне отображения
                                const filteredLesson = filteredSchedules.find(schedule => schedule.schedules.some(lesson => lesson.subject.id === lessonInfo.subject.id));
                                if (!filteredLesson) return null;

                                const subjectId = lessonInfo.subject.id;
                                const key = `${subjectId}-${dayName}`;
                                const isExpanded = expandedSubjects[key];

                                return (
                                    <div key={subjectId} className="lesson-info">
                                        <strong>{lessonInfo.subject.name}</strong> {lessonInfo.cabinet}{" "}
                                        {formatTeacherName(lessonInfo.teacher)} {formatType(lessonInfo.subject.type)}{" "}
                                        {formatTime(lessonInfo.date_n_time)}
                                        <button onClick={() => toggleAccordion(subjectId, dayName)} className="accordion-button">
                                            {isExpanded ? "Скрыть даты" : "Посмотреть"}
                                        </button>
                                        {isExpanded && <div className="dates-container">{formatDateList(dates)}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <AddScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddSchedule}
                teachers={teachers}
                subjects={subjects}
            />
        </div>
    );
};


export default SchedulePage;