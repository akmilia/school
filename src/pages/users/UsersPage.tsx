import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import {ErrorDisplay} from "../../components/ErrorDisplay";
import UsersApi from "../../api/users";
import './UserPage.css'


interface User {
    idusers: number;
    login: string;
    full_name: string;
    idroles: number;
  }

export const UsersPage = () => {
    const [teachers, setTeachers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(""); 
    const [error, setError] = useState<string | null>(null); // Состояние для ошибки
    const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await UsersApi.getTeachers();
                setTeachers(data);
            } catch (error) {
                console.error("Ошибка при получении преподавателей:", error);
                setError("Не удалось загрузить список преподавателей. Пожалуйста, попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <HeaderAdmin />
            <main className="main">
                <h1>Преподаватели</h1>
                
                {/* Отображаем ошибку, если она есть */}
                {error ? (
                    <ErrorDisplay error={error} />
                ) : (
                    <>
                        {/* Показываем индикатор загрузки */}
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTeachers.map(teacher => (
                                                <tr key={teacher.idusers}>
                                                    <td>{teacher.idusers}</td>
                                                    <td>{teacher.login || 'Не указан'}</td>
                                                    <td>{teacher.full_name || 'Не указано'}</td>
                                                </tr>
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