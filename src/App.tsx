import { Suspense, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LendingPage from './pages/lending/LendingPage';
import ProfilePage from './pages/profile/ProfilePage';
import SubjectPage from './pages/subject/SubjectPage';
import SchedulePage from './pages/schedule/SchedulePage';
import { UsersPage } from './pages/users/UsersPage';
import LoadingSpinner from './components/LoadingSpinner'; // Создайте этот компонент

function App() {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Защищённые маршруты
  const protectedRoutes = ['/profile', '/subjects', '/schedule', '/users'];

  useEffect(() => {
    if (!isInitialized) return; // Ждём инициализации auth состояния

    const path = location.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // if (!user && isProtectedRoute) {
    //   navigate('/main', { replace: true });
    // } else if (user && path === '/main') {
    //   navigate('/schedule', { replace: true });
    // }
  }, [user, isInitialized, navigate, location]);

  if (!isInitialized) {
    return <LoadingSpinner fullScreen />; // Показываем загрузку пока проверяется auth состояние
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path='/main' element={<LendingPage />} />
        {user && (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subjects" element={<SubjectPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            {user.role === 'admin' && (
              <Route path="/users" element={<UsersPage />} />
            )}
          </>
        )}
        <Route index element={<LendingPage />} />
        <Route path='*' element={<LendingPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;