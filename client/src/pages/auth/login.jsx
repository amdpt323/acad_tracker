
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password,setPasswrod] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async() => {
    console.log('logging in');
    const user = await login(username+'@iitk.ac.in' , password)
    if (user) {
      const dest = `/${user.role}/dashboard`;
      console.log(dest);
      navigate(dest)
    } else {
      setError('Invalid user. Try: Alice, Bob, or Charlie')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Login</h2>
        <input
          type='text'
          placeholder='Enter name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full px-4 py-2 border rounded mb-3'
        />
        <input
          type='password'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => setPasswrod(e.target.value)}
          className='w-full px-4 py-2 border rounded mb-3'
        />
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        <button
          onClick={handleLogin}
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
