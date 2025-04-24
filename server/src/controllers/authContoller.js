const prisma = require('../prisma/client')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(400).json({ error: 'Invalid credentials' })

  const token = generateToken(user)
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
}

// Admin manually adds users
exports.registerUser = async (req, res) => {
  const { name, email, password, role, department } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'User already exists' })

  const hashed = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, department },
  })

  res.json({ message: 'User created', user })
}

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const grouped = {
      students: users.filter((u) => u.role === 'student'),
      teachers: users.filter((u) => u.role === 'teacher'),
      admins: users.filter((u) => u.role === 'admin'),
    }

    res.json({users:grouped})
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}