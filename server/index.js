const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./src/routes/authRoutes')
const adminRoutes = require('./src/routes/adminroutes')
const studentRoutes = require('./src/routes/studentroutes')
const teacherRoutes = require('./src/routes/teacherRoutes')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/teacher', teacherRoutes)



app.get('/', (req, res) => res.send('API is running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
