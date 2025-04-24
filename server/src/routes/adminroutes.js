const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admincontoller')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

// Only admin can open/close registration
router.post(
  '/registration/open',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.openRegistration
)

router.post(
  '/registration/close',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.closeRegistration
)

router.get(
  '/registration/status',
  authMiddleware,
  roleMiddleware(['admin', 'student', 'teacher']),
  adminController.getRegistrationStatus
)

module.exports = router
