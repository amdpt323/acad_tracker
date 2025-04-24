import { logout } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

export const handleLogout = () => {
  const navigate = useNavigate();
  logout()
  navigate('/login')
}
