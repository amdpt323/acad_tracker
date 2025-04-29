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

// GET /api/teacher/courses-available

exports.getAvailableCourses = async (req, res) => {
  const teacherId = req.user.id; // assuming you're attaching user in auth middleware
  
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherId },
    include: { user: true },
  });

  if (!teacher) {
    return res.status(404).json({ error: "Teacher not found" });
  }

  const department = teacher.user.department;

  const courses = await prisma.course.findMany({
    where: {
      department: department,
      teacherId: null, // not assigned yet
    },
  });

  res.json({ courses });
};

// POST /api/teacher/assign-course
// body: { courseId }

exports.assignCourse = async (req, res) => {
  const teacherId = req.user.id;
  const { courseId } = req.body;

  // Check if course exists and is available
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (course.teacherId) {
    return res.status(400).json({ error: "Course already assigned to another teacher" });
  }

  // Optional: Check department match (safety)
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherId },
    include: { user: true },
  });

  if (teacher.user.department !== course.department) {
    return res.status(400).json({ error: "You can only select courses from your department" });
  }

  // Assign course
  await prisma.course.update({
    where: { id: courseId },
    data: {
      teacherId: teacherId,
    },
  });

  res.json({ message: "Course assigned successfully" });
};


exports.isTeacherAllottedToAnyCourse = async (req, res) => {
  const teacherId = req.user.id; 
  
  try {
    // Query the Course model to find any course assigned to the teacher
    const teacherCourses = await prisma.course.findMany({
      where: {
        teacherId: teacherId,  // Find courses with the teacherId
      },
    });

    // Check if the teacher is assigned any courses
    if (teacherCourses.length > 0) {
      return res.status(200).json({ status: 1 });
    } else {
      return res.status(200).json({ status: 0 });
    }
  } catch (error) {
    console.error('Error checking teacher courses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 1. Get all students who requested a course taught by the teacher
exports.getRequestedCoursesForTeacher = async (req, res) => {
  const teacherId = req.user.id // Assuming the teacher is authenticated and their ID is available
  try {
    // Fetch courses taught by this teacher
    const teacherCourses = await prisma.course.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        registrations: {
          where: { status: 'PENDING' }, // Only show pending course registrations
          select: {
            studentId: true,
            status: true,
            student: {
              select: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    })

    // Format the response to include student details for each course
    const coursesWithRequests = teacherCourses.map((course) => ({
      courseId: course.id,
      courseName: course.name,
      requests: course.registrations.map((registration) => ({
        studentId: registration.studentId,
        studentName: registration.student.user.name,
        studentEmail: registration.student.user.email,
        status: registration.status,
      })),
    }))

    if (coursesWithRequests.length === 0) {
      return res.status(404).json({ message: 'No requests found for your courses' })
    }

    return res.json(coursesWithRequests)
  } catch (error) {
    console.error('Error fetching course requests:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// 2. Accept or Reject a student’s course request
exports.updateCourseRequestStatus = async (req, res) => {
  const teacherId = req.user.id // Assuming the teacher is authenticated and their ID is available
  const { studentId, courseId, status } = req.body

  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Status must be either ACCEPTED or REJECTED.' })
  }

  try {
    // Check if the course is taught by the teacher
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { teacherId: true } })
    if (!course || course.teacherId !== teacherId) {
      return res.status(403).json({ error: 'You are not authorized to update this course request' })
    }

    // Check if the student has requested the course
    const registration = await prisma.courseRegistration.findFirst({
      where: { studentId, courseId },
    })

    if (!registration) {
      return res.status(404).json({ error: 'No such course request found' })
    }

    // Update the registration status (either ACCEPTED or REJECTED)
    const updatedRegistration = await prisma.courseRegistration.update({
      where: { id: registration.id },
      data: { status },
    })

    return res.json({ message: `Course request ${status.toLowerCase()} successfully`, updatedRegistration })
  } catch (error) {
    console.error('Error updating course request status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getAcceptedStudents = async (req, res) => {
  try {
    const teacherId = req.user.id

    // Check if registrations are closed
    const adminSettings = await prisma.adminSetting.findFirst()
    if (!adminSettings || adminSettings.isOpen) {
      return res.status(400).json({ message: 'Registrations are still open.' })
    }

    // Get all accepted students in teacher's courses
    const courses = await prisma.course.findMany({
      where: {
        teacherId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        registrations: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            student: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    department: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    res.json(courses)
  } catch (error) {
    console.error('Error fetching accepted students:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

exports.getCourseEvaluation = async (req, res) => {
  const teacherId = req.user.id;

  try {
    // Check if registrations are closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    });

    if (!adminSetting || adminSetting.isOpen) {
      return res.status(400).json({ message: 'Registrations are not closed yet.' });
    }

    // Find a course taught by this teacher
    const course = await prisma.course.findFirst({
      where: {
        teacherId: teacherId,
      },
      select: {
        id: true,
        name: true,
        totals: true,
        weights: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'No course assigned to this teacher.' });
    }

    // Check if evaluation has been fully filled
    const totalsFilled = Array.isArray(course.totals) && course.totals.length === 6 && course.totals.every(n => typeof n === 'number');
    const weightsFilled = Array.isArray(course.weights) && course.weights.length === 6 && course.weights.every(n => typeof n === 'number');

    if (!totalsFilled || !weightsFilled) {
      return res.status(200).json({
        message: 'Evaluation not yet fully set.',
        courseId: course.id,
        name: course.name,
        totals: course.totals ?? [],
        weights: course.weights ?? [],
        isComplete: false,
      });
    }

    res.json({
      message: 'Course evaluation fetched successfully.',
      courseId: course.id,
      name: course.name,
      totals: course.totals,
      weights: course.weights,
      isComplete: true,
    });
  } catch (error) {
    console.error('Error fetching course evaluation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.setCourseEvaluation = async (req, res) => {
  const { totals, weights } = req.body // totals and weights are arrays of 6 elements
  const teacherId = req.user.id // Assuming the teacher's ID is in the authenticated user's data

  try {
    // Check if registrations are closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    })

    if (!adminSetting || !adminSetting.isOpen) {
      return res
        .status(400)
        .json({ message: 'Course registration is not closed.' })
    }

    // Find the teacher's courses from CourseRegistration
    const courseRegistrations = await prisma.courseRegistration.findMany({
      where: { course: { teacherId: teacherId }, status: 'ACCEPTED' },
      include: { course: true }, // Get the course details
    })

    if (courseRegistrations.length === 0) {
      return res
        .status(400)
        .json({
          message: 'You have no accepted courses to set evaluation for.',
        })
    }

    // We assume that we are setting the same evaluation for all accepted courses for this teacher.
    // You can adjust this logic if the teacher has different evaluations for different courses.
    const courseId = courseRegistrations[0].course.id

    // Update the course with totals and weights
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        totals: totals,
        weights: weights,
      },
    })

    res.json(updatedCourse)
  } catch (error) {
    console.error('Error updating course evaluation:', error)
    res.status(500).json({ message: 'Failed to update course evaluation.' })
  }
}


exports.gradeStudent = async (req, res) => {
  const { courseId, studentId, marks } = req.body; // marks is an array of 6 elements
  const teacherId = req.user.id; // Assuming the teacher's ID is in the authenticated user's data

  try {
    // Check if registrations are closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    });

    if (!adminSetting || !adminSetting.isOpen) {
      return res.status(400).json({ message: 'Course registration is not closed.' });
    }

    // Check if the teacher is assigned to the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { teacher: true },
    });

    if (!course || course.teacherId !== teacherId) {
      return res.status(400).json({ message: 'You are not assigned to this course.' });
    }

    // Check if the student is registered for this course and the registration is accepted
    const registration = await prisma.courseRegistration.findFirst({
      where: {
        courseId: courseId,
        studentId: studentId,
        status: 'ACCEPTED', // Only grade students whose registrations are accepted
      },
    });

    if (!registration) {
      return res.status(400).json({ message: 'Student not registered or registration not accepted.' });
    }

    // Update the student's marks for the course
    const updatedRegistration = await prisma.courseRegistration.update({
      where: { id: registration.id },
      data: { marks: marks },
    });

    res.json(updatedRegistration);
  } catch (error) {
    console.error('Error grading student:', error);
    res.status(500).json({ message: 'Failed to grade student.' });
  }
}

exports.assignGrades = async (req, res) => {
  const { grades } = req.body // grades = [{ studentId: "...", grade: "A" }, ...]
  const teacherId = req.user.id

  try {
    // Check if registrations are closed
    const adminSetting = await prisma.adminSetting.findUnique({
      where: { id: 1 },
    })
    if (adminSetting?.isOpen) {
      return res
        .status(403)
        .json({
          message: 'Registrations are still open. Cannot assign grades yet.',
        })
    }

    // Check if the teacher is assigned to the course
    const course = await prisma.course.findFirst({
      where: { teacherId: teacherId },
    })

    if (!course) {
      return res
        .status(403)
        .json({
          message: 'You are not authorized to assign grades for this course.',
        })
    }

    // Update grades for each student
    const updatePromises = grades.map(({ studentId, grade }) =>
      prisma.courseRegistration.updateMany({
        where: {
          courseId:course.id,
          studentId,
          status: 'ACCEPTED',
        },
        data: {
          grade,
        },
      })
    )

    await Promise.all(updatePromises)

    return res.json({ message: 'Grades assigned successfully.' })
  } catch (error) {
    console.error('Error assigning grades:', error)
    return res.status(500).json({ message: 'Failed to assign grades.' })
  }
}