
// src/pages/teacher/CourseRequests.jsx
import { useEffect, useState } from 'react'
import RoleLayout from '../../components/RoleLayout'
import { fetchCourseRequests, updateCourseRequestStatus } from '../../services/teacherService'
import { getRegistrationStatus } from '../../services/authService'

const TeacherCourseRequests = () => {
  const [requests, setRequests] = useState([])
  const [courseId,setCourseId] = useState(null);

  const [registrationOpen, setRegistrationOpen] = useState(false) // mock status, should be fetched from backend

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchCourseRequests()
        console.log(data);
        setCourseId(data[0].courseId);
        setRequests(data[0].requests || []);
      } catch (error) {
        console.error('Error fetching course requests:', error)
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
    fetchRequests()
  }, [])

  const handleDecision = async (courseId, studentId, decision) => {
    if (!registrationOpen) return

    try {
      const response = await updateCourseRequestStatus(courseId, studentId, decision)

      if (response.message) {
        const updatedRequests = requests.map((req) =>
          req.courseId === courseId && req.studentId === studentId
            ? { ...req, status: decision }
            : req
        )
        setRequests(updatedRequests)
      }
    } catch (error) {
      console.error('Error updating course request status:', error)
    }
  }

  return (
    <RoleLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Course Requests</h2>

        {!registrationOpen && (
          <p className="text-red-500">
            Registration is closed. You can't respond to requests.
          </p>
        )}

        {requests.length === 0 ? (
          <p>No course requests for your courses.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.studentId} // Unique key for each request (combining courseId and studentId)
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {req.studentName} requested{' '}
                    <span className="text-blue-600">{req.courseName}</span>
                  </p>
                  <p className="text-sm text-gray-500">Status: {req.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleDecision(courseId, req.studentId, 'ACCEPTED')
                    }
                    disabled={!registrationOpen || req.status !== 'PENDING'}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleDecision(courseId, req.studentId, 'REJECTED')
                    }
                    disabled={!registrationOpen || req.status !== 'PENDING'}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
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
