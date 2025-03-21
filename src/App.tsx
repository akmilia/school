import { Suspense } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'

import LendingPage from './pages/lending/LendingPage'
import ProfilePage from './pages/profile/ProfilePage'
import SubjectPage from './pages/subject/SubjectPage'
import SchedulePage from './pages/schedule/SchedulePage'
import { UsersPage } from './pages/users/UsersPage'

function App() {
  const user_role = localStorage.getItem('user_role')
  const navigate = useNavigate()

  if (!user_role) {
    navigate('./main')
  }

  return (
    <Suspense>
      <Routes>
        {/* <Route path='/' element={<Layout />}> */}
          <Route path='/main' element={<LendingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subjects" element={<SubjectPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/users" element={<UsersPage />} />
        {/* </Route> */}

        <Route index element={<LendingPage /> } />
        <Route path='*' element={<LendingPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
