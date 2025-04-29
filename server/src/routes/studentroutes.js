const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentContoller')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

// Only student can request course
router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.post(
  '/request-course',
  studentController.requestCourse
)

router.get('/courses-available',studentController.getAvailableCoursesForStudent);
router.get('/requested-courses',studentController.requestedCoursesForStudent);
router.get('/accepted-courses',studentController.getAcceptedCourses);
router.get('/get-student-grades',studentController.getStudentGrades);


module.exports = router
