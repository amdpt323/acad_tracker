const prisma = require('../prisma/client')

exports.openRegistration = async (req, res) => {
  await prisma.adminSetting.upsert({
    where: { id: 1 },
    update: { isOpen: true },
    create: { id: 1, isOpen: true },
  })
  res.json({ message: 'Course registration opened' })
}

exports.closeRegistration = async (req, res) => {
  await prisma.adminSetting.update({
    where: { id: 1 },
    data: { isOpen: false },
  })
  res.json({ message: 'Course registration closed' })
}

exports.getRegistrationStatus = async (req, res) => {
  const setting = await prisma.adminSetting.findUnique({ where: { id: 1 } })
  res.json({ isOpen: setting?.isOpen ?? false })
}
