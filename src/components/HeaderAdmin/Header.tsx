import cl from './Header.module.css';
import Bell from '../../assets/bell.png';
import Profile from '../../assets/Profile.png';
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
