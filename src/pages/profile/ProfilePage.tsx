import { useEffect, useState } from 'react';
import Header from '../../components/HeaderAdmin/Header';
import cl from './Profile.module.css';
import axios from 'axios';

interface ProfileData {
    idusers: number;
    full_name: string; 
    login: string;  
    birthdate: string; // Изменено с Date на string для отображения
    idroles: number; 
}

interface CourseData {
    name: string;
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<ProfileData>({
        idusers: 0,
        full_name: '', 
        login: '', 
        birthdate: '', // Изменено с Date на string
        idroles: 0
    });
    const [courses, setCourses] = useState<CourseData[]>([]);
    const access_token = localStorage.getItem('access_token');
    const base_url = import.meta.env.VITE_BASE_URL; 

    // Функция для получения данных пользователя
    const getProfileData = async () => {
        try { 
            const [profileResponse, coursesResponse] = await Promise.all([
                axios.get(`${base_url}/current-user`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }),
                axios.get(`${base_url}/user-courses`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                })
            ]);
            
            const profileData = profileResponse.data;
            setProfile({
                idusers: profileData.idusers,
                full_name: profileData.full_name,
                birthdate: profileData.birthdate ? 
                    new Date(profileData.birthdate).toLocaleDateString() : 'Не указана',
                login: profileData.login,
                idroles: profileData.idroles,
            });

            setCourses(coursesResponse.data);
        } catch (error) {
            console.error("Ошибка при получении данных профиля:", error);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    // Преобразуем роль в строку
    const formatRole = (idroles: number) => {
        switch (idroles) {
            case 1:
                return 'Администратор';
            case 2:
                return 'Преподаватель';
            case 3:
                return 'Ученик';
            default:
                return 'Неизвестная роль';
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
                                <b>ФИО:</b> {profile.full_name}
                            </p> 
                            <p id="login">
                                <b>Логин:</b> {profile.login}
                            </p>
                            <p id="status">
                                <b>Статус:</b> {formatRole(profile.idroles)}
                            </p> 
                            <p id="birthdate">
                                <b>Дата рождения:</b> {profile.birthdate}
                            </p>
                        </div> 

                        <div className={cl.profile_item}>
                            <h2>Занятия</h2>
                            {courses.length > 0 ? (
                                <ul>
                                    {courses.map((course, index) => (
                                        <li key={index}>{course.name}</li> 
                                    ))}
                                </ul>
                            ) : (
                                <p>Нет активных занятий</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;