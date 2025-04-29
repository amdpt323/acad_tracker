// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { getUser } from '../services/authService'

const Sidebar = () => {
  const user = getUser()
  const role = user?.role

  const links = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/register-course', label: 'Registrations' },
      { path: '/student/courses', label: 'My Courses' },
      { path: '/student/performance', label: 'Performance' },
    ],
    teacher: [
      { path: '/teacher/dashboard', label: 'Dashboard' },
      { path: '/teacher/requests', label: 'Course Requests' },
      { path: '/teacher/students', label: 'Students' },
      { path: '/teacher/grading', label: 'Grading Scheme' },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/manage-users', label: 'Manage Users' },
      { path: '/admin/assignments', label: 'Assignments' },
    ],
  }

  return (
    <aside className='w-64 bg-gray-100 h-full p-4 hidden md:block'>
      <nav className='space-y-3'>
        {links[role]?.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-blue-100 ${
                isActive ? 'bg-blue-200 font-semibold' : ''
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
