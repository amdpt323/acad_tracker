// src/pages/student/CourseRegistration.jsx
import { useEffect, useState } from 'react'
import RoleLayout from '../../components/RoleLayout'

const mockCourses = [
  {
    id: 101,
    name: 'Operating Systems',
    type: 'Dept Compulsory',
    teacher: 'Prof. A',
  },
  { id: 102, name: 'AI & ML', type: 'Dept Elective', teacher: 'Prof. B' },
  { id: 103, name: 'Economics', type: 'Open Elective', teacher: 'Prof. C' },
]

const StudentCourseRegistration = () => {
  const [registrationOpen, setRegistrationOpen] = useState(true) // mock state
  const [courses, setCourses] = useState([])
  const [requestedCourses, setRequestedCourses] = useState([])

  useEffect(() => {
    // simulate fetching course list and registration status
    setCourses(mockCourses)
    // fetch registrationOpen status from backend later
  }, [])

  const requestCourse = (courseId) => {
    if (!registrationOpen) return

    const course = courses.find((c) => c.id === courseId)
    if (!requestedCourses.find((rc) => rc.id === courseId)) {
      setRequestedCourses([
        ...requestedCourses,
        { ...course, status: 'Pending' },
      ])
    }
  }

  return (
    <RoleLayout>
      <div className='space-y-6'>
        <h2 className='text-xl font-bold'>Course Registration</h2>
        {!registrationOpen && (
          <p className='text-red-500 font-medium'>
            Registration is currently closed.
          </p>
        )}
        <div className='grid gap-4'>
          <h3 className='text-lg font-semibold'>Available Courses</h3>
          <ul className='space-y-2'>
            {courses.map((course) => (
              <li
                key={course.id}
                className='border rounded p-4 flex justify-between items-center'
              >
                <div>
                  <p className='font-semibold'>{course.name}</p>
                  <p className='text-sm text-gray-600'>
                    {course.type} | {course.teacher}
                  </p>
                </div>
                <button
                  onClick={() => requestCourse(course.id)}
                  disabled={
                    !registrationOpen ||
                    requestedCourses.find((rc) => rc.id === course.id)
                  }
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded disabled:opacity-50'
                >
                  {requestedCourses.find((rc) => rc.id === course.id)
                    ? 'Requested'
                    : 'Request'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold mt-6'>My Requested Courses</h3>
          {requestedCourses.length === 0 ? (
            <p className='text-gray-500'>No course requests made.</p>
          ) : (
            <ul className='space-y-2 mt-2'>
              {requestedCourses.map((course) => (
                <li
                  key={course.id}
                  className='border rounded p-3 flex justify-between items-center'
                >
                  <div>
                    <p className='font-medium'>{course.name}</p>
                    <p className='text-sm'>{course.type}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                      course.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : course.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {course.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </RoleLayout>
  )
}

export default StudentCourseRegistration
