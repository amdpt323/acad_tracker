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

// Fetch all courses available for the student
exports.getAvailableCoursesForStudent = async (req, res) => {
  const studentId = req.user.id;

  try {
    // Get the student's department
    const student = await prisma.student.findUnique({
      where: { userId: studentId },
      include: { user: true },  // To get department info
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const department = student.user.department;

    // Fetch all courses where:
    // - Teacher is assigned
    // - The course is either of the student's department, or INSTITUTE_COMPULSORY/OPEN_ELECTIVE
    const availableCourses = await prisma.course.findMany({
      where: {
        teacherId: {
          not: null,  // Ensure the course has a teacher assigned
        },
        OR: [
          { department: department },  // Same department as student
          { courseType: 'INSTITUTE_COMPULSORY' },  // Institute compulsory
          { courseType: 'OPEN_ELECTIVE' },  // Open elective
        ],
      },
      include: {
        teacher: true,  // Include teacher info
      },
    });

    if (availableCourses.length === 0) {
      return res.status(404).json({ error: 'No available courses found' });
    }

    res.json({ availableCourses });
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all courses requested by a student
exports.requestedCoursesForStudent = async (req, res) => {
  const studentId = req.user.id // Assuming studentId comes from authenticated user
  try {
    // Fetch the requested courses for this student
    const requestedCourses = await prisma.courseRegistration.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            courseType: true,
            teacher: {
              select: {
                user: {
                  select: {
                    name: true, // Assuming teacher has a 'name' field
                  },
                },
              },
            },
          },
        },
      },
    })

    // Format the response with course details and their statuses
    const formattedCourses = requestedCourses.map((registration) => {
      return {
        id: registration.course.id,
        name: registration.course.name,
        courseType: registration.course.courseType,
        teacherName: registration.course.teacher?.user.name,
        status: registration.status,
      }
    })

    return res.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching requested courses:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


exports.getAcceptedCourses = async (req, res) => {
  const studentId  = req.user.id

  try {
    // 1. Check if registration is closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    })

    if (!adminSetting || adminSetting.isOpen) {
      return res
        .status(403)
        .json({ error: 'Course registrations are still open.' })
    }

    // 2. Get all accepted courses for this student
    const acceptedCourses = await prisma.courseRegistration.findMany({
      where: {
        studentId,
        status: 'ACCEPTED',
      },
      include: {
        course: true, // includes full course info
      },
    })

    return res.status(200).json({
      acceptedCourses: acceptedCourses.map((reg) => reg.course),
    })
  } catch (error) {
    console.error('Error fetching accepted courses:', error)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}



exports.getStudentGrades = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if registration is closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    });

    if (!adminSetting || adminSetting.isOpen) {
      return res.status(400).json({ message: "Grades not available until registration is closed." });
    }

    // Fetch all accepted registrations with grades for the student
    const grades = await prisma.courseRegistration.findMany({
      where: {
        studentId: userId,
        status: 'ACCEPTED',
        NOT: { grade: null }, // Ensure grade is set
      },
      include: {
        course: {
          select: {
            name: true,
            code: true,
            courseType: true,
            department: true,
          },
        },
      },
    });

    const result = grades.map((reg) => ({
      courseName: reg.course.name,
      courseCode: reg.course.code,
      courseType: reg.course.courseType,
      department: reg.course.department,
      grade: reg.grade || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching student grades:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
