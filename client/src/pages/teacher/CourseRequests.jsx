// src/pages/teacher/CourseRequests.jsx
import { useEffect, useState } from 'react'
import RoleLayout from '../../components/RoleLayout'

// Mock data
const mockCourseRequests = [
  {
    id: 1,
    courseId: 101,
    course: 'Operating Systems',
    student: 'John',
    status: 'Pending',
    teacher: 'Prof. A',
  },
  {
    id: 2,
    courseId: 102,
    course: 'AI & ML',
    student: 'Alice',
    status: 'Pending',
    teacher: 'Prof. B',
  },
  {
    id: 3,
    courseId: 101,
    course: 'Operating Systems',
    student: 'Eve',
    status: 'Accepted',
    teacher: 'Prof. A',
  },
]

const currentTeacher = 'Prof. A' // Ideally fetched from auth

const TeacherCourseRequests = () => {
  const [requests, setRequests] = useState([])
  const [registrationOpen, setRegistrationOpen] = useState(true) // mock status

  useEffect(() => {
    // Simulate fetching data
    const myRequests = mockCourseRequests.filter(
      (req) => req.teacher === currentTeacher
    )
    setRequests(myRequests)
  }, [])

  const handleDecision = (id, decision) => {
    if (!registrationOpen) return

    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: decision } : req
    )
    setRequests(updated)
  }

  return (
    <RoleLayout>
      <div className='space-y-6'>
        <h2 className='text-xl font-bold'>Course Requests</h2>

        {!registrationOpen && (
          <p className='text-red-500'>
            Registration is closed. You can't respond to requests.
          </p>
        )}

        {requests.length === 0 ? (
          <p>No course requests for your courses.</p>
        ) : (
          <div className='space-y-3'>
            {requests.map((req) => (
              <div
                key={req.id}
                className='border rounded p-4 flex justify-between items-center'
              >
                <div>
                  <p className='font-medium'>
                    {req.student} requested{' '}
                    <span className='text-blue-600'>{req.course}</span>
                  </p>
                  <p className='text-sm text-gray-500'>Status: {req.status}</p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleDecision(req.id, 'Accepted')}
                    disabled={!registrationOpen || req.status !== 'Pending'}
                    className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50'
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, 'Rejected')}
                    disabled={!registrationOpen || req.status !== 'Pending'}
                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50'
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleLayout>
  )
}

export default TeacherCourseRequests
