import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { authService } from '../../api/login'; 
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '../../assets/menu.png';
import CloseIcon from '../../assets/close.png';
import { Link } from 'react-router-dom';
import cl from '../../components/HeaderAdmin/Header.module.css';

const LendingPage = () => {
    const faqQuestions = [
        'Кто мы и откуда?',
        'Что мы делаем?',
        'Как начать с нами сотрудничать?'
    ];
    
    const faqAnswers = [
        'Мы (я и мое раздвоение личности) - полная команда проекта и мы пытаемся закончить этот колледж.',
        'Мы занимаемся разработкой инновационных решений.',
        'Свяжитесь с нами, а наша команда предложит вам наилучшее решение. Все официально - сертификаты соответсвия стандартам, договора и соглашения.',
    ];
    
    const [expandedAnswers, setExpandedAnswers] = useState([false, false, false]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    const toggleAnswer = (index: number) => {
        const newExpandedAnswers = [...expandedAnswers];
        newExpandedAnswers[index] = !newExpandedAnswers[index];
        setExpandedAnswers(newExpandedAnswers);
    };
    
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const formData = new FormData(event.currentTarget);
        const credentials = {
            login: formData.get('login') as string,
            password: formData.get('password') as string
        };

        try {
            const tokenData = await authService.login(credentials.login, credentials.password);
            authLogin(tokenData);
            navigate('/profile');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };
    
    const showMessage = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        alert('Эти данные хранятся у администратора системы. Пожалуйста, обратитесь к руководству вашей школы');
    }

    return (
        <>
            <header className={cl.headerWrapper}>
                <div className={cl.header}>
                    <div className={cl.headerLeft}>
                        <h1 className={cl.headerTitle}>
                            <Link to="/">НОВАЯ ШКОЛА</Link>
                        </h1>
                    </div>

                    <button className={cl.menuButton} onClick={toggleMenu}>
                        <img 
                            src={isMenuOpen ? CloseIcon : MenuIcon} 
                            alt="Меню" 
                            className={cl.menuIcon} 
                        />
                    </button>

                    <nav className={`${cl.nav} ${isMenuOpen ? cl.navOpen : ''}`}>
                        <ul className={cl.navList}>
                            <li><a href="#with-us" className={cl.navLink} >О проекте</a></li>
                            <li><a href="#schools" className={cl.navLink} >Школы</a></li>
                            <li><a href="#faq" className={cl.navLink} >F&Q</a></li>
                            <li><a href="#contacts" className={cl.navLink} >Связь с нами</a></li>
                        </ul>
                    </nav>
                </div>
                {isMenuOpen && <div className={cl.overlay} onClick={toggleMenu} />}
            </header>

            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-container">
                        <div className="hero-image">
                            <img src='src/assets/girl.png' alt="Девочка" />
                        </div>

                        <div className="login-container">
                            <h2>НОВАЯ ШКОЛА</h2>  
                            {error && <div className="error-message">{error}</div>} 

                            <form onSubmit={handleLogin} className="login-form">
                                <input 
                                    name="login" 
                                    placeholder="Логин" 
                                    required
                                    disabled={isLoading}
                                />
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Пароль" 
                                    required
                                    disabled={isLoading}
                                />
                                
                                <a 
                                    href="#" 
                                    onClick={showMessage} 
                                    className="forgot-password"
                                >
                                    Забыли пароль?
                                </a>
                                
                                <button 
                                    type="submit" 
                                    className="login-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Вход...' : 'Войти'}
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    disabled={isLoading}
                                >
                                    Вход через Госуслуги
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="features-section" id="with-us">
                    <h2>С нами удобнее</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Официально</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Просто</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laboe et dolore magna aliqua.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Доступно везде и онлайн</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                    </div>
                </section>

                <section className="schools-section" id='schools'>
                    <h2>Школы</h2>
                    <div className="schools-grid">
                        <div className="school-card">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                        <div className="school-card">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                        <div className="school-card">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                    </div>
                </section>

                <section className="faq-section" id='faq'>
                    <h2>Ответы на популярные вопросы</h2>
                    <div className="faq-list">
                        {faqQuestions.map((question, index) => (
                            <div className="faq-item" key={index}>
                                <div className='faq-question' onClick={() => toggleAnswer(index)}>
                                    <h4>{question}</h4>
                                    <span className="faq-toggle">
                                        {expandedAnswers[index] ? '−' : '+'}
                                    </span>
                                </div>
                                {expandedAnswers[index] && (
                                    <div className='faq-answer'>
                                        <p>{faqAnswers[index]}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main> 
            <label id='contacts'></label>
            <Footer />
        </>
    );
}

export default LendingPage;