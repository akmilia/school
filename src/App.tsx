import { Suspense, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'

import LendingPage from './pages/lending/LendingPage'
import ProfilePage from './pages/profile/ProfilePage'
import SubjectPage from './pages/subject/SubjectPage'
import SchedulePage from './pages/schedule/SchedulePage'
import { UsersPage } from './pages/users/UsersPage'

function App() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    
    if (!token && path !== '/main') {
        navigate('/main');
    } else if (token && path === '/main') {
        const role = localStorage.getItem('user_role');
        navigate('/schedule');
    }
}, [navigate]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/main' element={<LendingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/users" element={<UsersPage />} />
    
        <Route index element={<LendingPage />} />
        <Route path='*' element={<LendingPage />} />
      </Routes>
    </Suspense>
  )
}

export default App