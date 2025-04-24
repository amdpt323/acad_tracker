const prisma = require('../prisma/client')

// View all pending requests for teacher's courses
exports.getPendingRequests = async (req, res) => {
  const teacherId = req.user.id

  const requests = await prisma.courseRegistration.findMany({
    where: {
      course: {
        teacherId,
      },
      status: 'PENDING',
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      course: true,
    },
  })

  res.json({ requests })
}

// Accept or reject a student's request
exports.handleRequest = async (req, res) => {
  const teacherId = req.user.id
  const { registrationId, action } = req.body // action: 'ACCEPTED' or 'REJECTED'

  if (!['ACCEPTED', 'REJECTED'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' })
  }

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: registrationId },
    include: {
      course: true,
    },
  })

  if (!registration || registration.course.teacherId !== teacherId) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  const updated = await prisma.courseRegistration.update({
    where: { id: registrationId },
    data: { status: action },
  })

  res.json({
    message: `Request ${action.toLowerCase()}`,
    registration: updated,
  })
}
