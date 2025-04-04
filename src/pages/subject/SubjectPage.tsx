import { useEffect, useState } from "react";
import { getSubjects } from "../../api/getSubjects"; // Предположим, что addSubject - это функция для POST-запроса
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import './SubjectPage.css'; // Импортируем файл стилей

const SubjectPage = () => {
    const [subjects, setSubjects] = useState([]); // Состояние для хранения данных
    const [newSubject, setNewSubject] = useState({
        name: '',
        description: '',
        type: 'sport'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user_role = localStorage.getItem("user_role");
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    // const handleAddSubject = async () => {
    //     try {
    //         const response = await addSubject(newSubject); // Отправляем POST-запрос
    //         setSubjects(prevSubjects => [...prevSubjects, response.data]); // Обновляем состояние
    //         setIsModalOpen(false); // Закрываем модальное окно
    //         setNewSubject({ name: '', description: '', type: 'sport' }); // Сбрасываем форму
    //     } catch (error) {
    //         console.error("Ошибка при добавлении предмета:", error);
    //     }
    // };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getSubjects(); // Получаем данные
                setSubjects(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchSubjects(); // Вызываем функцию загрузки данных
    }, []);

    return (
        <div>
            <HeaderAdmin />

            <main className="main">
                <h1>Наши занятия и курсы</h1>

                {user_role === "admin" && (
                    <button onClick={() => setIsModalOpen(true)}>Добавить</button>
                ) }

                {/* Таблица для отображения данных */}
                <table className="subjects-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>ID Subject</th>
                            <th>Тип</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={subject.id}>
                                <td>{index + 1}</td>
                                <td>{subject.name}</td>
                                <td>{subject.description}</td>
                                <td>{subject.id}</td>
                                <td>{subject.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Модальное окно для добавления нового предмета
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Добавить новый предмет</h2>
                            <label>
                                Название:
                                <input
                                    type="text"
                                    name="name"
                                    value={newSubject.name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Описание:
                                <input
                                    type="text"
                                    name="description"
                                    value={newSubject.description}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Тип:
                                <select
                                    name="type"
                                    value={newSubject.type}
                                    onChange={handleInputChange}
                                >
                                    <option value="sport">Спорт</option>
                                    <option value="art">Искусство</option>
                                    <option value="free">Бесплатно</option>
                                    <option value="paid">Платно</option>
                                </select>
                            </label>
                            <button onClick={handleAddSubject}>Добавить</button>
                            <button onClick={() => setIsModalOpen(false)}>Отмена</button>
                        </div>
                    </div>
                )} */}
            </main>
        </div>
    );
};

export default SubjectPage;