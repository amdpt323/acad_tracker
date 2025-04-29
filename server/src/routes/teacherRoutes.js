const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teachercontoller')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware)
router.use(roleMiddleware(['teacher']))

// Get all pending registration requests for teacher's courses
router.get('/pending-requests', teacherController.getPendingRequests)

// Accept or reject a course request
router.post('/handle-request', teacherController.handleRequest)

router.post('/courses-available',teacherController.getAvailableCourses);

router.post('/assign-course',teacherController.assignCourse);

router.post('/isAllotted',teacherController.isTeacherAllottedToAnyCourse);

router.get('/requested-courses',teacherController.getRequestedCoursesForTeacher);

router.post('/update-course-request-status',teacherController.updateCourseRequestStatus);

router.get('/accepted-students',teacherController.getAcceptedStudents);

router.post('/set-course-evaluation',teacherController.setCourseEvaluation);

router.get('/get-course-evaluation',teacherController.getCourseEvaluation);

router.post('/grade-student',teacherController.gradeStudent);

router.post('/assign-grades',teacherController.assignGrades);

module.exports = router
