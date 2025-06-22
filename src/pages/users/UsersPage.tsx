import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import { ErrorDisplay } from "../../components/ErrorDisplay";
import UsersApi from "../../api/users";
import './UserPage.css'

interface TeacherSubject {
    subject_id: number;
    subject_name: string;
    schedule_count: number;
}

interface Teacher {
    idusers: number;
    login: string;
    full_name: string;
    subjects: TeacherSubject[];
}

export const UsersPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await UsersApi.getTeachersWithSubjects();
                setTeachers(data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const toggleTeacherExpand = (teacherId: number) => {
        setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <HeaderAdmin />
            <main className="main">
                <h1>Преподаватели и их занятия</h1>
                
                {error ? (
                    <ErrorDisplay error={error} />
                ) : (
                    <>
                        {isLoading ? (
                            <div className="loading-message">Загрузка данных...</div>
                        ) : (
                            <>
                                <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder="Поиск по ФИО"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                                
                                {filteredTeachers.length > 0 ? (
                                    <table className="users-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Логин</th>
                                                <th>ФИО</th>
                                                <th>Кол-во занятий</th>
                                                <th>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTeachers.map(teacher => (
                                                <>
                                                    <tr key={teacher.idusers}>
                                                        <td>{teacher.idusers}</td>
                                                        <td>{teacher.login || 'Не указан'}</td>
                                                        <td>{teacher.full_name || 'Не указано'}</td>
                                                        <td>
                                                            {teacher.subjects.reduce(
                                                                (sum, subject) => sum + subject.schedule_count, 0
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button 
                                                                onClick={() => toggleTeacherExpand(teacher.idusers)}
                                                                className="expand-button"
                                                            >
                                                                {expandedTeacher === teacher.idusers ? 'Скрыть' : 'Показать'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedTeacher === teacher.idusers && (
                                                        <tr className="subjects-row">
                                                            <td colSpan={5}>
                                                                <div className="subjects-container">
                                                                    <h4>Преподаваемые предметы:</h4>
                                                                    {teacher.subjects.length > 0 ? (
                                                                        <ul className="subjects-list">
                                                                            {teacher.subjects.map(subject => (
                                                                                <li key={subject.subject_id}>
                                                                                    {subject.subject_name} 
                                                                                    <span className="schedule-count">
                                                                                        (занятий: {subject.schedule_count})
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <p>Нет назначенных предметов</p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-results">
                                        {searchTerm 
                                            ? "Преподаватели по вашему запросу не найдены"
                                            : "Список преподавателей пуст"
                                        }
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};
// import { useEffect, useState } from "react";
// import HeaderAdmin from "../../components/HeaderAdmin/Header";
// import {ErrorDisplay} from "../../components/ErrorDisplay";
// import UsersApi from "../../api/users";
// import './UserPage.css'


// interface User {
//     idusers: number;
//     login: string;
//     full_name: string;
//     idroles: number;
//   }

// export const UsersPage = () => {
//     const [teachers, setTeachers] = useState<User[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>(""); 
//     const [error, setError] = useState<string | null>(null); // Состояние для ошибки
//     const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки

//     useEffect(() => {
//         const fetchTeachers = async () => {
//             try {
//                 setIsLoading(true);
//                 setError(null);
//                 const data = await UsersApi.getTeachers();
//                 setTeachers(data);
//             } catch (error) {
//                 console.error("Ошибка при получении преподавателей:", error);
//                 setError("Не удалось загрузить список преподавателей. Пожалуйста, попробуйте позже.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchTeachers();
//     }, []);

//     const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//     };

//     const filteredTeachers = teachers.filter(teacher =>
//         teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//             <HeaderAdmin />
//             <main className="main">
//                 <h1>Преподаватели</h1>
                
//                 {/* Отображаем ошибку, если она есть */}
//                 {error ? (
//                     <ErrorDisplay error={error} />
//                 ) : (
//                     <>
//                         {/* Показываем индикатор загрузки */}
//                         {isLoading ? (
//                             <div className="loading-message">Загрузка данных...</div>
//                         ) : (
//                             <>
//                                 <div className="search-container">
//                                     <input
//                                         type="text"
//                                         placeholder="Поиск по ФИО"
//                                         value={searchTerm}
//                                         onChange={handleSearch}
//                                     />
//                                 </div>
                                
//                                 {filteredTeachers.length > 0 ? (
//                                     <table className="users-table">
//                                         <thead>
//                                             <tr>
//                                                 <th>ID</th>
//                                                 <th>Логин</th>
//                                                 <th>ФИО</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {filteredTeachers.map(teacher => (
//                                                 <tr key={teacher.idusers}>
//                                                     <td>{teacher.idusers}</td>
//                                                     <td>{teacher.login || 'Не указан'}</td>
//                                                     <td>{teacher.full_name || 'Не указано'}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 ) : (
//                                     <div className="no-results">
//                                         {searchTerm 
//                                             ? "Преподаватели по вашему запросу не найдены"
//                                             : "Список преподавателей пуст"
//                                         }
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 )}
//             </main>
//         </div>
//     );
// };