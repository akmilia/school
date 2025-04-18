import cl from './Header.module.css';
import Bell from '../../assets/bell.png';
import Profile from '../../assets/Profile.png';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Предполагается, что у вас есть AuthContext

// const HeaderAdmin = () => {
//     const navigate = useNavigate();
//     const { user } = useContext(AuthContext); // Используем контекст для получения данных пользователя

//     // Функция для безопасного получения роли пользователя
//     const getUserRole = () => {
//         try {
//             return user?.role || localStorage.getItem('user_role');
//         } catch (error) {
//             console.error('Error accessing user data:', error);
//             return null;
//         }
//     };
    
//     useEffect(() => {
//         console.log('Current user role:', localStorage.getItem('user_role'));
//         console.log('Access token exists:', !!localStorage.getItem('access_token'));
//       }, []); 

//     const user_role = getUserRole(); 
    

//     return (
//         <header className={cl.header_wrapper}>
//             <div className={cl.header}>
//                 <h2 className={cl.header_h2} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
//                     НОВАЯ ШКОЛА
//                 </h2>
                
//                 <nav className={cl.nav}>
//                     <ul className={cl.nav_list}>
//                         <li><a href="/schedule">Расписание</a></li>
//                         <li><a href="/subjects">Занятия</a></li> 
//                         <li><a href="/users">Преподаватели</a></li> 
//                         {/* {user_role === 'Преподаватель' && (
//                             <li><a href="/users">Пользователи</a></li>
//                         )} */}
//                     </ul>
//                 </nav>
                
//                 <div className={cl.header_images}>
//                     <img src={Bell} alt="Уведомления" className={cl.header_icon} />
//                     <img 
//                         src={Profile} 
//                         alt="Профиль" 
//                         className={cl.header_icon}
//                         onClick={() => navigate('/profile')} 
//                         style={{ cursor: 'pointer' }}
//                     />
//                 </div>
//             </div>
//         </header>
//     );
// };
import { Link, useNavigate } from 'react-router-dom'; 

const HeaderAdmin = () => {
  const navigate = useNavigate();

  return (
    <header className={cl.headerWrapper}>
      <div className={cl.header}>
        <div className={cl.headerLeft}>
          <h1 className={cl.headerTitle}>
            <Link to="/">НОВАЯ ШКОЛА</Link>
          </h1>
        </div>

        <nav className={cl.nav}>
          <ul className={cl.navList}>
            <li><Link to="/schedule" className={cl.navLink}>Расписание</Link></li>
            <li><Link to="/subjects" className={cl.navLink}>Занятия</Link></li>
            <li><Link to="/users" className={cl.navLink}>Преподаватели</Link></li>
          </ul>
        </nav>

        <div className={cl.headerRight}>
          <button className={cl.notificationBtn}>
            <img src={Bell} alt="Уведомления" className={cl.icon} />
          </button>
          <button
            className={cl.profileBtn}
            onClick={() => navigate('/profile')}
          >
            <img src={Profile} alt="Профиль" className={cl.icon} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
