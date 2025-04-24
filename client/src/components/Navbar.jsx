// src/components/Navbar.jsx
import { logout, getUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const user = getUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='w-full bg-blue-700 text-white flex justify-between items-center px-4 py-3 shadow-md'>
      <div className='text-xl font-bold'>Academic Tracker</div>
      <div className='flex items-center gap-4'>
        <span>
          {user?.name} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
