import { useState, useEffect } from 'react';
import cl from './Header.module.css';
import Bell from '../../assets/bell.png';
import Profile from '../../assets/Profile.png';
import MenuIcon from '../../assets/menu.png';
import CloseIcon from '../../assets/close.png';
import { Link, useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Блокировка прокрутки при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Затемнение фона */}
      {isMenuOpen && <div className={cl.overlay} onClick={toggleMenu} />}
      
      <header className={cl.headerWrapper}>
        <div className={cl.header}>
          <div className={cl.headerLeft}>
            <h1 className={cl.headerTitle}>
              <Link to="/">НОВАЯ ШКОЛА</Link>
            </h1>
          </div>

          {/* Кнопка меню для мобильных */}
          <button className={cl.menuButton} onClick={toggleMenu}>
            <img 
              src={isMenuOpen ? CloseIcon : MenuIcon} 
              alt="Меню" 
              className={cl.menuIcon} 
            />
          </button>

          <nav className={`${cl.nav} ${isMenuOpen ? cl.navOpen : ''}`}>
            <ul className={cl.navList}>
              <li><Link to="/schedule" className={cl.navLink} onClick={toggleMenu}>Расписание</Link></li>
              <li><Link to="/subjects" className={cl.navLink} onClick={toggleMenu}>Занятия</Link></li>
              <li><Link to="/users" className={cl.navLink} onClick={toggleMenu}>Преподаватели</Link></li>
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
    </>
  );
};

export default HeaderAdmin;