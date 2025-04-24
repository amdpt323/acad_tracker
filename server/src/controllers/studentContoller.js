const prisma = require('../prisma/client')

// Student requests a course
exports.requestCourse = async (req, res) => {
  const studentId = req.user.id
  const { courseId } = req.body

  const setting = await prisma.adminSetting.findUnique({ where: { id: 1 } })
  if (!setting?.isOpen)
    return res.status(403).json({ error: 'Registration is closed' })

  // Check if already requested
  const existing = await prisma.courseRegistration.findFirst({
    where: {
      studentId,
      courseId,
    },
  })

  if (existing)
    return res.status(400).json({ error: 'Already requested this course' })

  const registration = await prisma.courseRegistration.create({
    data: {
      studentId,
      courseId,
    },
  })

  res.json({ message: 'Course registration requested', registration })
}
