
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/login'
import StudentDashboard from '../pages/student/Dashboard'
import TeacherDashboard from '../pages/teacher/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'
import PrivateRoute from './PrivateRoute'
import StudentCourseRegistration from "../pages/student/CourseRegistration";
import TeacherCourseRequests from "../pages/teacher/CourseRequests";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<Login />} />

      <Route element={<PrivateRoute role='student' />}>
        <Route path='/student/dashboard' element={<StudentDashboard />} />
        <Route path="/student/register-course" element={<StudentCourseRegistration />} />
      </Route>

      <Route element={<PrivateRoute role='teacher' />}>
        <Route path='/teacher/dashboard' element={<TeacherDashboard />} />
         <Route path="/teacher/requests" element={<TeacherCourseRequests />} />
      </Route>

      <Route element={<PrivateRoute role='admin' />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
