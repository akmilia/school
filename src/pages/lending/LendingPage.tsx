import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { login } from '../../api/login';
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
    
    const Login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const user_login = formData.get('login') as string
        const user_password = formData.get('password') as string
        
        try {
          const response = await login(user_login, user_password)
          if (response.status === 200) {
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('user_role', response.data.role)
            navigate('/schedule') // Все роли идут на одну страницу
          }
        } catch (error) {
          alert('Неверный логин или пароль')
        }
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
                            <form onSubmit={Login}>
                                <input  name="email" placeholder="Эл. почта" />
                                <input type="password" name="password" placeholder="Пароль" /> 
                                <a href="#" className="forgot-password">Забыли пароль?</a>
                                <button type="submit" className="login-button">Войти</button> 
                                <button className="gosuslugi-button">Вход через Госуслуги</button>
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
