const express = require('express')
const router = express.Router()
const authController = require('../controllers/authContoller')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

// Login for all users
router.post('/login', authController.login)

// Only admin can register users
router.post(
  '/register',
  authMiddleware,
  roleMiddleware(['admin']),
  authController.registerUser
)

router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  authController.getUsers
)

router.get('/get-registration-status',authMiddleware,authController.getRegistrationStatus)
router.post('/set-registration-status',authMiddleware
  ,roleMiddleware(['admin']),
  authController.setRegistrationStatus
)

module.exports = router
