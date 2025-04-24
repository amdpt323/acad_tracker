const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentContoller')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

// Only student can request course
router.post(
  '/request-course',
  authMiddleware,
  roleMiddleware(['student']),
  studentController.requestCourse
)

module.exports = router
