import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { authService } from '../../api/login'; 
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';


const LendaingPage = () => {
    const faqQuestions = [
        'Кто мы и откуда?',
        'Что мы делаем?',
        'Как начать с нами сотрудничать?'
    ];
    
    const faqAnswers = [
        'Мы (я и мое раздвоение личности) - полная команда проекта и мы пытаемся закончить этот колледж.',
        'Мы занимаемся разработкой инновационных решений.',
        'Свяжитесь с нами, а наша команда предложит вам наилучшее решение. Все официально - сертификаты соответсвия стандартам, договора и соглашения. ',
    ];
    
    const [expandedAnswers, setExpandedAnswers] = useState([false, false, false]);
    
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
            // Используем новый сервис авторизации
            const tokenData = await authService.login(credentials.login, credentials.password);
            
            // Сохраняем данные через AuthContext
            authLogin(tokenData);
            
            // Перенаправляем на защищенную страницу
            navigate('/profile');
        } catch (error: any) { // Явно указываем тип any для error
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
            <header>
                <div className="header">
                    <nav className="nav">
                        <ul className="nav-list">
                            <li><a href="#with-us">О проекте</a></li>
                            <li><a href="#schools">Школы</a></li>
                            <li><a href="#faq">F&Q</a></li>
                            <li><a href="#contacts">Связь с нами</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="main">
                <div className="top-section">
                    <div className="start">
                        <div className="image-container">
                            <img src='src/assets/girl.png' alt="Девочка" />
                        </div>

                        <div className="login-form">
                            <h1>НОВАЯ ШКОЛА</h1>  
                            {error && <div className="error-message">{error}</div>} 

                             <form onSubmit={handleLogin}>
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
                        className="gosuslugi-button"
                        disabled={isLoading}
                    >
                        Вход через Госуслуги
                    </button>
                </form>
                        </div>
                    </div>
                </div>

                <section className="with-us" id="with-us">
                    <h2>С нами удобнее</h2>
                    <div className="convenience-items">
                        <div className="convenience-item">
                            <h3>Официально</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
                        </div>
                        <div className="convenience-item">
                            <h3>Просто</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laboe et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
                        </div>
                        <div className="convenience-item">
                            <h3>Доступно везде и онлайн</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
                        </div>
                    </div>
                </section>

                <section className="schools" id='schools'>
                    <h2>Школы</h2>
                    <div className="school-items">
                        <div className="school-item">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                        <div className="school-item">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                        <div className="school-item">
                            <img src="src/assets/school_icon.png" alt="Школа №97" />
                            <p>Школа №97</p>
                        </div>
                    </div>
                </section>

                <section className="faq" id='faq'>
                    <h2>Ответы на популярные вопросы</h2>
                    <div className="faq-items">
                        {faqQuestions.map((question, index) => (
                            <div className="faq-item" key={index}>
                                <div className='faq-item-header'>
                                    <h4>{question}</h4>
                                    <button onClick={() => toggleAnswer(index)} className="faq-answer-button">
                                        {expandedAnswers[index] ? '—' : '+'}
                                    </button>
                                </div>
                                <div className='faq-item-answer'>
                                    {expandedAnswers[index] && <p>{faqAnswers[index]}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default LendaingPage;
