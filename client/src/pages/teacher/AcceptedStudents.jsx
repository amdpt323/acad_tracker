// pages/teacher/AcceptedStudentsPage.jsx
import React, { useEffect, useState } from 'react'
import { fetchAcceptedStudents } from '../../services/teacherService'
import RoleLayout from '../../components/RoleLayout'

const AcceptedStudentsPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getAcceptedStudents = async () => {
      try {
        const response = await fetchAcceptedStudents()
        setData(response)
      } catch (err) {
        setError('Failed to fetch accepted students.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getAcceptedStudents()
  }, [])

  if (loading) return <RoleLayout><div className='p-4'>Loading...</div></RoleLayout>
  if (error) return <RoleLayout><div className='p-4 text-red-600'>Check Once the Registation is Closed !</div></RoleLayout>

  return (
    <RoleLayout>
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Accepted Students</h2>
        {data.length === 0 ? (
          <div>No accepted students or registrations may still be open.</div>
        ) : (
          data.map((course) => (
            <div key={course.id} className='mb-6 border p-4 rounded shadow'>
              <h3 className='text-xl font-semibold mb-2'>
                {course.name} ({course.code})
              </h3>
              {course.registrations.length === 0 ? (
                <p>No students accepted yet.</p>
              ) : (
                <ul className='list-disc ml-6'>
                  {course.registrations.map((reg, index) => (
                    <li key={index}>
                      {reg.student.user.name} - {reg.student.user.email} (
                      {reg.student.user.department})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </RoleLayout>
  )
}

export default AcceptedStudentsPage
