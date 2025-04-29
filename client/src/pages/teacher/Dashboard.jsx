
import React, { useState, useEffect } from 'react'
import RoleLayout from '../../components/RoleLayout'
import {
  isTeacherAllottedToAnyCourse,
  getAvailableCourses,
  assignCourse,
} from '../../services/teacherService' // Import service functions

const TeacherDashboard = () => {
  const [isAllotted, setIsAllotted] = useState(null)
  const [availableCourses, setAvailableCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [message, setMessage] = useState('')

 

  useEffect(() => {
    // Check if teacher is allotted any course
    const checkAllottedStatus = async () => {
      const status = await isTeacherAllottedToAnyCourse()
      setIsAllotted(status)

      if (status === 0) {
        // Fetch available courses if not allotted
        const courses = await getAvailableCourses()
        setAvailableCourses(courses)
      }
    }

    checkAllottedStatus()
  }, [])

  const handleCourseSelect = async () => {
    if (!selectedCourse) {
      setMessage('Please select a course')
      return
    }

    const response = await assignCourse(selectedCourse)
    if (response) {
      setMessage(response) // Display success or error message
    }
  }

  return (
    <RoleLayout>
      <h1 className='text-2xl font-bold'>Welcome to Teacher Dashboard</h1>

      {isAllotted === 0 && availableCourses.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-lg'>Select a Course to Teach</h2>
          <select
            className='border p-2 mt-2'
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value=''>--Select a Course--</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
          <button
            className='mt-4 p-2 bg-blue-500 text-white'
            onClick={handleCourseSelect}
          >
            Submit
          </button>
        </div>
      )}

      {message && <p className='mt-4 text-red-500'>{message}</p>}
    </RoleLayout>
  )
}

export default TeacherDashboard
