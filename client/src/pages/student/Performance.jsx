import { useEffect, useState } from 'react'
import RoleLayout from '../../components/RoleLayout'
import { getStudentGrades } from '../../services/studentService'
import { getRegistrationStatus } from '../../services/authService'


const Performance = () => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [registrationOpen, setRegistrationOpen] = useState(false)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await getStudentGrades()
        console.log(res);
        setGrades(res)
      } catch (err) {
        console.error('Failed to fetch grades', err)
      } finally {
        setLoading(false)
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

    fetchGrades()
  }, [])

  return (
    <RoleLayout>
      {registrationOpen ? <p>Please Check this once the Registrations are closed</p> : 
      <div className='p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6 text-center'>My Performance</h2>

        {loading ? (
          <p className='text-center text-gray-500'>Loading grades...</p>
        ) : grades.length === 0 ? (
          <p className='text-center text-gray-500'>No courses found.</p>
        ) : (
          <div className='space-y-4'>
            {grades.map((course, index) => (
              <div
                key={index}
                className='border p-4 rounded shadow bg-white flex flex-col gap-2'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='text-lg font-semibold'>
                      {course.courseName} ({course.courseCode})
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {course.department} ·{' '}
                      {course.courseType.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className='text-lg font-bold text-right'>
                    {course.grade ? (
                      <span className='text-green-600'>
                        {course.grade.replace('_STAR', '*')}
                      </span>
                    ) : (
                      <span className='text-gray-500 italic'>
                        Not Yet Graded
                      </span>
                    )}
                  </div>
                </div>

                {course.marks?.length === 6 && (
                  <div className='text-sm text-gray-700'>
                    <p>Marks: {course.marks.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      } 
    </RoleLayout>
  )
}

export default Performance
