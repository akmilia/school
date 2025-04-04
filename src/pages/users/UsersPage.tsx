import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import UsersClass from "../../api/UsersClass";
import './UserPage.css'

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredRole, setFilteredRole] = useState<number | null>(null); // Состояние для фильтра роли
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Состояние для открытия выпадающего фильтра
    const user_role = localStorage.getItem("user_role");

    const getUsers = async () => {
        try {
            const response = await UsersClass.getUsers();
            if (response && Array.isArray(response)) {
                setUsers(response);
            } else {
                console.error("Неверные данные от API");
            }
        } catch (error) {
            console.error("Ошибка при получении пользователей:", error);
        }
    }

    const formatUserRole = (role_id) => {
        switch (role_id) {
            case 1:
                return <td>Администратор</td>;
            case 2:
                return <td>Преподаватель</td>;
            case 3:
                return <td>Ученик</td>;
            default:
                return <td>Неизвестный</td>;
        }
    }

    // const handleAddUser = async (userData) => {
    //     try {
    //         const response = await UsersClass.addUser(userData); // Отправляем POST-запрос
    //         setUsers([...users, response.data]); // Обновляем состояние
    //         getUsers(); // Обновляем список пользователей после добавления
    //     } catch (error) {
    //         console.error("Ошибка при добавлении пользователя:", error);
    //     }
    // };

    useEffect(() => {
        getUsers();
    }, []);

    // Фильтрация пользователей по роли
    const filteredUsers = filteredRole === null ? users : users.filter(user => user.role_id === filteredRole);

    // Проверка наличия пользователей
    const renderUsersTable = () => {
        if (filteredUsers.length === 0) {
            return <p>Нет пользователей для отображения.</p>;
        }

        return (
            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                        <th>День рождения</th>
                        <th>Роль</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user?.name || 'Не указано'}</td>
                            <td>{user?.surname || 'Не указана'}</td>
                            <td>{user?.paternity || 'Не указано'}</td>
                            <td>{user?.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Не указана'}</td>
                            {formatUserRole(user?.role_id)}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <HeaderAdmin />

            <main className="main">
                <h1>Пользователи</h1>
                <div className='buttons'>
                {user_role === "admin" && (
                    <button onClick={() => setIsModalOpen(true)}>Добавить пользователя</button>
                )}
                    <div className="filter-container">
                        <button onClick={() => setIsFilterOpen(prev => !prev)}>
                            Фильтр
                        </button>
                        {isFilterOpen && (
                            <div className="filter-dropdown">
                                <select
                                    onChange={(e) => setFilteredRole(Number(e.target.value))}
                                    value={filteredRole || ''}
                                >
                                    <option value="">Все</option>
                                    <option value="1">Администратор</option>
                                    <option value="2">Преподаватель</option>
                                    <option value="3">Ученик</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {renderUsersTable()}
            </main>

        </div>
    )
}
