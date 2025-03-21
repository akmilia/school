import { useEffect, useState } from 'react';
import Header from '../../components/HeaderAdmin/Header';
import cl from './Profile.module.css';
import axios from 'axios';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        surname: '',
        name: '',
        paternity: '',
        gender: '',
        birthdate: '',
        login: '',
        role_id: 0,
    });
    const access_token = localStorage.getItem('token')

    // Функция для получения данных пользователя
    const getProfileData = async () => {
        try {
            const response = await axios.get('http://miwory.ru:5555/v1/profile', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            }); // Подставьте ваш API endpoint
            const data = response.data;

            // Преобразуем дату в формат, который вам нужен (например, dd/mm/yyyy)
            const birthdate = new Date(data.birthdate).toLocaleDateString();

            setProfile({
                ...data,
                birthdate, // преобразуем дату, если нужно
            });
        } catch (error) {
            console.error("Ошибка при получении данных профиля:", error);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []); // Вызываем один раз при монтировании компонента

    // Преобразуем роль в строку
    const formatRole = (role_id: number) => {
        switch (role_id) {
            case 1:
                return 'Администратор';
            case 2:
                return 'Преподаватель';
            case 3:
                return 'Ученик';
            default:
                return 'Неизвестный';
        }
    };

    return (
        <div className={cl.profile_page}>
            <Header />
            <main className={cl.main}>
                <section className={cl.profile}>
                    <h1>Профиль</h1>
                    <div className={cl.profile_items}>
                        <div className={cl.profile_image}>
                            <img src="src/assets/profile.png" alt="profile" />
                        </div>

                        <div className={cl.profile_item}>
                            <h2>Личные данные</h2>
                            <p id="fio">
                                <b>ФИО:</b> {profile.surname} {profile.name} {profile.paternity}
                            </p>
                            <p id="birthdate">
                                <b>Дата рождения:</b> {profile.birthdate}
                            </p>
                            <p id="gender">
                                <b>Пол:</b> {profile.gender === 'M' ? 'Мужской' : 'Женский'}
                            </p>
                            <p id="status">
                                <b>Статус:</b> {formatRole(profile.role_id)}
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
