import api from "../utils/axios"

// Check if teacher has been allotted a course
export const isTeacherAllottedToAnyCourse = async () => {
  try {
    const { data } = await api.post(`/teacher/isAllotted`)
    return data.status // Return status 1 if allotted, 0 if not
  } catch (error) {
    console.error('Error checking teacher course:', error)
    return null
  }
}

// Fetch available courses for the teacher
export const getAvailableCourses = async () => {
  try {
    const { data } = await api.post(`/teacher/courses-available`)
    return data.courses
  } catch (error) {
    console.error('Error fetching available courses:', error)
    return []
  }
}

// Assign a course to the teacher
export const assignCourse = async (courseId) => {
  try {
    const { data } = await api.post(`/teacher/assign-course`, { courseId })
    return data.message // Returns success message
  } catch (error) {
    console.error('Error assigning course:', error)
    return null
  }
}

// Function to fetch the course requests for the teacher
export const fetchCourseRequests = async () => {
  try {
    const response = await api.get('/teacher/requested-courses')
    return response.data
  } catch (error) {
    console.error('Error fetching course requests:', error)
    throw error
  }
}

// Function to accept or reject a course request
export const updateCourseRequestStatus = async (courseId, studentId, status) => {
  try {
    const response = await api.post('/teacher/update-course-request-status',{ courseId, studentId, status })
    return response.data
  } catch (error) {
    console.error('Error updating course request status:', error)
    throw error
  }
}

export const fetchAcceptedStudents = async()=>{

  try {
    const response = await api.get('/teacher/accepted-students');
    return response.data;
  } catch (error) {
    console.log('Error Fetching Accepted Students',error);
    throw error;
  }
}


export const getCourseEvaluations = async()=>{
  try {
    const response = await api.get('/teacher/get-course-evaluation')
    return response.data
  } catch (error) {
    console.log('Error Fetching Course Evaluations', error)
    throw error
  }
}

export const setCourseEvaluation = async (totals,weights) => {
  try {
    const response = await api.post('/teacher/get-course-evaluation',{totals,weights})
    return response.data
  } catch (error) {
    console.log('Error Setting Course Evaluations', error)
    throw error
  }
}

export const submitGrades = async(grades)=>{

  try {
    const response = await api.post('/teacher/assign-grades',{grades});
    return response.data;
  } catch (error) {
    console.log('Error Submitting Grades',error)
    throw error
  }
}