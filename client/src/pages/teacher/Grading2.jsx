// GradeStudentsPage.jsx
import React, { useEffect, useState } from 'react'
import { fetchAcceptedStudents, submitGrades } from '../../services/teacherService'
import RoleLayout from '../../components/RoleLayout'
import { getRegistrationStatus } from '../../services/authService'

const GradeStudentsPage = ({ courseId }) => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistrataionOpen , setRegistrationOpen] = useState(false);

  const gradeOptions = ['A_STAR', 'A', 'B', 'C', 'D', 'E', 'F']

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetchAcceptedStudents();
        console.log(res);
        const studentUsers =
          res[0]?.registrations.map((reg) => reg.student.user) || []

        setStudents(studentUsers)
        setGrades(
          studentUsers.reduce(
            (acc, student) => ({ ...acc, [student.id]: '' }),
            {}
          )
        )
      } catch (err) {
        console.error('Failed to fetch students', err)
      }
    }

    const getStatus = async()=>{
        try {
          const data = await getRegistrationStatus();
          setRegistrationOpen(data.isOpen)
        } catch (error) {
          console.log(error);
        }
        
    }

    getStatus();

    fetchStudents()
  }, [courseId])

  const handleGradeChange = (studentId, grade) => {
    setGrades((prev) => ({ ...prev, [studentId]: grade }))
  }

  const allGraded =
    students.length > 0 && students.every((student) => grades[student.id])

  const handleSubmit = async () => {
    const gradesArray = Object.entries(grades).map(([studentId, grade]) => ({
      studentId,
      grade,
    }))
    if (!allGraded) return
    setIsSubmitting(true)
    try {
      await submitGrades(gradesArray)
      alert('Grades submitted successfully')
    } catch (err) {
      console.error('Failed to submit grades', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  if(isRegistrataionOpen) return <RoleLayout><div className='text-red-500 mt-4'>Will be available once the registration closes</div></RoleLayout>
  return (
    <RoleLayout>
      <div className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-xl font-bold mb-4'>Grade Students</h2>
        {students.map((student) => (
          <div
            key={student.id}
            className='flex items-center justify-between mb-2 border-b pb-2'
          >
            <span>
              {student.name} ({student.email})
            </span>
            <select
              value={grades[student.id]}
              onChange={(e) => handleGradeChange(student.id, e.target.value)}
              className='border p-1 rounded'
            >
              <option value=''>Select grade</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={!allGraded || isSubmitting}
          className={`mt-4 px-4 py-2 rounded ${
            allGraded
              ? 'bg-blue-600 text-white'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Grades
        </button>
      </div>
    </RoleLayout>
  )
}

export default GradeStudentsPage
