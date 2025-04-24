
import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../services/authService'

const PrivateRoute = ({ role }) => {
  const user = getUser()
  if (!user) return <Navigate to='/login' />
  const userRole = user.role;
  console.log(userRole);
  if (userRole !== role) return <Navigate to={`/${userRole}/dashboard`} />
  return <Outlet />
}

export default PrivateRoute
