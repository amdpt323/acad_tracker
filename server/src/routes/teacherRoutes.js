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

module.exports = router
