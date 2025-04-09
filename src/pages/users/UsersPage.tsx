import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import UsersClass from "../../api/UsersClass";
import './UserPage.css'
    interface User {
        idusers: number;
        login: string;
        full_name: string;
        roles_idroles: number;
        role?: string;
      }

export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredRole, setFilteredRole] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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


    const formatUserRole = (idroles: number): string => {
        switch (idroles) {
            case 1:
                return "Администратор";
            case 2:
                return "Преподаватель";
            case 3:
                return "Ученик";
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const filteredUsers = filteredRole === null 
    ? users 
    : users.filter(user => user.roles_idroles === filteredRole);

const renderUsersTable = () => {
    if (filteredUsers.length === 0) {
        return <p>Нет пользователей для отображения.</p>;
    }

    return (
        <table className="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Логин</th>
                    <th>ФИО</th>
                    <th>Роль</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map((user, index) => (
                    <tr key={user.idusers}>
                        <td>{user.idusers}</td>
                        <td>{user.login || 'Не указан'}</td>
                        <td>{user.full_name || 'Не указано'}</td>
                        <td>{user.role || formatUserRole(user.roles_idroles)}</td>
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
                    <button onClick={() => setIsModalOpen(true)}>
                        Добавить пользователя
                    </button>
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