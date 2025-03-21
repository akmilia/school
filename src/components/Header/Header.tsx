import { useNavigate } from 'react-router-dom';
import Bell from '../../assets/bell.png';
import Profile from '../../assets/Profile.png';
import cl from './Header.module.css'

const Header = () => {
    const navigate = useNavigate()
  
    return (
        <header>
            <div className={cl.header}>
                <h2 className={cl.header_h2}>НОВАЯ ШКОЛА</h2>
                <nav className={cl.nav}>
                    <ul className={cl.nav_list}>
                    <li><a href="/schedule">Расписание</a></li>
                    <li><a href="/subjects">Занятия</a></li>
                    </ul>
                </nav>
                <div className={cl.header_images}>
                    <img src={Bell} alt="bell-photo" />
                    <img onClick={() => {navigate('/profile')}} src={Profile} alt="profile-photo" />
                </div>
            </div>
        </header>
    );
  };
  
  export default Header;