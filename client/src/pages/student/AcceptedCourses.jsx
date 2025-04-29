import React, { useEffect, useState } from 'react'
import api from '../../utils/axios'
import RoleLayout from '../../components/RoleLayout'

const AcceptedCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAcceptedCourses = async () => {
      try {
        const res = await api.get(`/student/accepted-courses`)
        const data = await res.data
        console.log(res);
        setCourses(data.acceptedCourses)
      } catch (err) {
        setError('Course Registrations are still Open!')
      } finally {
        setLoading(false)
      }
    }

    fetchAcceptedCourses()
  }, [])

  if (loading) return <RoleLayout> <div className='text-center mt-4'>Loading...</div> </RoleLayout>
  if (error) return <RoleLayout><div className='text-red-500 mt-4'>{error}</div></RoleLayout>

  return (
    <RoleLayout>
      <div className='max-w-3xl mx-auto mt-8 p-4 bg-white rounded-xl shadow'>
        <h1 className='text-2xl font-semibold mb-4'>Your Accepted Courses</h1>

        {courses.length === 0 ? (
          <p className='text-gray-600'>No courses have been accepted yet.</p>
        ) : (
          <ul className='space-y-4'>
            {courses.map((course) => (
              <li
                key={course.id}
                className='p-4 border rounded-lg shadow-sm hover:shadow-md'
              >
                <h2 className='text-lg font-bold'>{course.name}</h2>
                <p className='text-sm text-gray-600'>Code: {course.code}</p>
                <p className='text-sm text-gray-600'>
                  Department: {course.department}
                </p>
                <p className='text-sm text-gray-600'>
                  Type: {course.courseType.replace(/_/g, ' ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RoleLayout>
  )
}

export default AcceptedCoursesPage
