import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/HeaderAdmin/Header';
import cl from './Profile.module.css';
import api from '../../api/login';   

interface UserResponseSchemaBirthdate {
  idusers: number;
  full_name: string;
  login: string;
  birthdate: string;
  id_roles: number;
  user_role: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserResponseSchemaBirthdate>({
    idusers: 0,
    full_name: '', 
    login: '', 
    birthdate: '',
    id_roles: 0,
    user_role: ''
  }); 

  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogout = () => {
    logout();
    // Дополнительно можно очистить поля формы входа, если она здесь присутствует
  };

  const fetchProfileData = async () => {
    try {
      const [profileResponse, coursesResponse] = await Promise.all([
        api.get('/api/current-user'),
        api.get('/api/user-courses')
      ]);
      
      if (!profileResponse.data || !coursesResponse.data) {
        throw new Error('Invalid response data');
      }
      
      setProfile({
        idusers: profileResponse.data.idusers,
        full_name: profileResponse.data.full_name || 'Не указано',
        login: profileResponse.data.login,
        birthdate: profileResponse.data.birthdate
          ? new Date(profileResponse.data.birthdate).toLocaleDateString()
          : 'Не указана',
        id_roles: profileResponse.data.id_roles,
        user_role: profileResponse.data.user_role
      });
  
      setCourses(coursesResponse.data || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        logout();
      }
      setError('Ошибка загрузки данных');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line
  }, [user]);

  if (loading) {
    return (
      <div className={cl.profile_page}>
        <Header />
        <main className={cl.main}>
          <p>Загрузка данных профиля...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cl.profile_page}>
        <Header />
        <main className={cl.main}>
          <p className={cl.error}>{error}</p>
          <button onClick={fetchProfileData}>Повторить попытку</button>
        </main>
      </div>
    );
  }

  return (
    <div className={cl.profile_page}>
      <Header />
      <main className={cl.main}>
        <section className={cl.profile}>
          <h1>Профиль</h1>
          <div className={cl.profile_items}>
            <div className={cl.profile_image}>
              <img src="/assets/profile.png" alt="profile" />
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
                <b>Статус:</b> {profile.user_role}
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
                    <li key={index}>{course}</li> 
                  ))}
                </ul>
              ) : (
                <p>Нет активных занятий</p>
              )}
            </div>
          </div>
        </section> 
        <section className={cl.profile}>
          <h1>Дополнительно</h1>
          <div className={cl.profile_items}>
                 <button onClick={handleLogout}>Выйти из аккаунта</button> 

            <div style={{ marginTop: '20px' }}>
            <h2>Документация</h2>
            <a href="/docs/documentation.pdf" download>
              Скачать документацию (PDF)
            </a>
            <br />
            <a href="/docs" target="_blank" rel="noopener noreferrer">
              Открыть документацию онлайн
            </a>
          </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
