import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/HeaderAdmin/Header';
import cl from './Profile.module.css';
import { authService } from '../../api/login';  

interface UserProfile {
  idusers: number;
  full_name: string;
  login: string;
  birthdate: string;
  id_roles: number;
  user_role: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
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
  
  const fetchProfileData = async () => {
    if (!user) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }
    
    try { 
      setLoading(true);
      setError(null);
      
      const [profileData, coursesData] = await Promise.all([
        authService.getCurrentUser(),
        authService.getUserCourses()
      ]);
  
      setProfile({
        idusers: profileData.idusers,
        full_name: profileData.full_name || 'Не указано',
        login: profileData.login,
        birthdate: profileData.birthdate 
        ? new Date(profileData.birthdate).toLocaleDateString() 
        : 'Не указана',
        id_roles: profileData.id_roles,
        user_role: profileData.user_role
      });
  
      setCourses(coursesData || []);
    } catch (err: any) {
      console.error("Ошибка при получении данных профиля:", err);
      setError('Не удалось загрузить данные профиля');
      if (err.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
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
      </main>
    </div>
  );
};

export default ProfilePage;