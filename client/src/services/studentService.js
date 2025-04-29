// src/services/studentService.js
import api from '../utils/axios'



// Fetch available courses for the student
export const fetchAvailableCourses = async () => {
  try {
    const response = await api.get(`/student/courses-available`)
    return response.data.availableCourses
  } catch (error) {
    console.error('Error fetching available courses:', error)
    throw error
  }
}

// Request a course for the student
export const requestCourse = async (courseId) => {
  try {
    const response = await api.post(`/student/request-course`, { courseId })
    return response.data
  } catch (error) {
    console.error('Error requesting course:', error)
    throw error
  }
}

export const fetchRequestedCourses = async() => {
    try {
        const response = await api.get('/student/requested-courses');
        return response.data
    } catch (error) {
        console.error('Error fetching requested courses:',error);
        throw error
    }
}

export const fetchAcceptedCourses = async()=>{
  try {
    const response = await api.get('/student/accepted-courses');
    return response.data
  } catch (error) {
    console.log('Error Fetching accepted courses',error);
    throw error;
  }
}

export const getStudentGrades = async()=>{
  try {
    const response = await api.get('/student/get-student-grades');
    return response.data;
  } catch (error) {
    console.log('Error Fetching Grades',error);
    throw error;
  }
}