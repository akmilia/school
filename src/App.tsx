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
  //      <BrowserRouter>
  //      <Routes>
  //          <Route path="/" element={<LendingPage />} />
  //          <Route path="/admin" element={
  //              <ProtectedRoute allowedRoles={[1]}>
  //                  <AdminPage />
  //              </ProtectedRoute>
  //          } />
  //          <Route path="/teacher" element={
  //              <ProtectedRoute allowedRoles={[2]}>
  //                  <TeacherPage />
  //              </ProtectedRoute>
  //          } />
  //          <Route path="/student" element={
  //              <ProtectedRoute allowedRoles={[3]}>
  //                  <StudentPage />
  //              </ProtectedRoute>
  //          } />
  //      </Routes>
  //  </BrowserRouter>
  )
}

export default App

   
