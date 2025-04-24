// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import RoleLayout from '../../components/RoleLayout'
import { fetchUsers, register } from '../../services/authService'

const AdminDashboard = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false) // this should come from backend
  const [users, setUsers] = useState()
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'student',
    department: 'CSE',
  })

  useEffect(() => {
    // Fetch registration status and user list
    // Placeholder logic for now
    getAllUsers();
  }, [])

  const getAllUsers = async ()=>{
    const fetchedUsers = await fetchUsers();
    
    setUsers(fetchedUsers)
  }

  const toggleRegistration = () => {
    setRegistrationOpen(!registrationOpen)
    // send API call here
  }

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  const createUser = async() => {
    if (!newUser.name.trim()) return
    await register(newUser.name,newUser.role,newUser.department);
  }

  return (
    <RoleLayout>
      <div className='space-y-8'>
        <h2 className='text-2xl font-bold'>Admin Dashboard</h2>

        {/* Registration toggle */}
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>Course Registration Control</h3>
          <button
            onClick={toggleRegistration}
            className={`px-4 py-2 rounded text-white font-medium ${
              registrationOpen ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {registrationOpen ? 'Close Registration' : 'Open Registration'}
          </button>
          <p className='text-sm text-gray-600 mt-1'>
            Current status:{' '}
            <span
              className={registrationOpen ? 'text-green-600' : 'text-red-600'}
            >
              {registrationOpen ? 'Open' : 'Closed'}
            </span>
          </p>
        </div>

        {/* User Creation */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Create Student/Teacher</h3>
          <div className='flex gap-4 flex-wrap'>
            <input
              type='text'
              name='name'
              value={newUser.name}
              onChange={handleInputChange}
              placeholder='Name'
              className='border px-3 py-1 rounded w-48'
            />
            <select
              name='role'
              value={newUser.role}
              onChange={handleInputChange}
              className='border px-3 py-1 rounded'
            >
              <option value='student'>Student</option>
              <option value='teacher'>Teacher</option>
            </select>
            <select
              name='department'
              value={newUser.department}
              onChange={handleInputChange}
              className='border px-3 py-1 rounded'
            >
              <option value='CSE'>CSE</option>
              <option value='EE'>EE</option>
              <option value='MTH'>MTH</option>
            </select>
            <button
              onClick={createUser}
              className='bg-blue-600 text-white px-4 py-1 rounded'
            >
              Create
            </button>
          </div>

          {/* User List */}
          <div className='mt-4 space-y-6'>
            {['students', 'teachers', 'admins'].map((category) => {
              const userList = users?.[category] ?? [] // safe fallback to empty array

              return (
                <div key={category}>
                  <h4 className='font-semibold text-md capitalize'>
                    {category}
                  </h4>

                  {userList.length > 0 ? (
                    <table className='min-w-full text-sm border border-gray-200'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='border px-2 py-1 text-left'>ID</th>
                          <th className='border px-2 py-1 text-left'>Name</th>
                          <th className='border px-2 py-1 text-left'>
                            Department
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userList.map((user, index) => (
                          <tr
                            key={user.id}
                            className='odd:bg-white even:bg-gray-50'
                          >
                            <td className='border px-2 py-1'>{index + 1}</td>
                            <td className='border px-2 py-1'>{user.name}</td>
                            <td className='border px-2 py-1'>
                              {user.department || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className='text-sm text-gray-500 mt-1'>
                      No {category} found.
                    </p>
                  )}
                </div>
              )
            })}
          </div>


        </div>
      </div>
    </RoleLayout>
  )
}

export default AdminDashboard
