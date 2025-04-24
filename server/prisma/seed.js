const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const courses = [
    // CSE Courses
    {
      name: 'Data Structures',
      code: 'CSE101',
      courseType: 'INSTITUTE_COMPULSORY',
      department: 'CSE',
    },
    {
      name: 'Algorithms',
      code: 'CSE102',
      courseType: 'DEPARTMENT_COMPULSORY',
      department: 'CSE',
    },
    {
      name: 'Operating Systems',
      code: 'CSE201',
      courseType: 'DEPARTMENT_ELECTIVE',
      department: 'CSE',
    },

    // EE Courses
    {
      name: 'Circuit Theory',
      code: 'EE101',
      courseType: 'INSTITUTE_COMPULSORY',
      department: 'EE',
    },
    {
      name: 'Signal Processing',
      code: 'EE102',
      courseType: 'DEPARTMENT_COMPULSORY',
      department: 'EE',
    },
    {
      name: 'Control Systems',
      code: 'EE201',
      courseType: 'DEPARTMENT_ELECTIVE',
      department: 'EE',
    },

    // MTH Courses
    {
      name: 'Linear Algebra',
      code: 'MTH101',
      courseType: 'INSTITUTE_COMPULSORY',
      department: 'MTH',
    },
    {
      name: 'Calculus',
      code: 'MTH102',
      courseType: 'DEPARTMENT_COMPULSORY',
      department: 'MTH',
    },
    {
      name: 'Number Theory',
      code: 'MTH201',
      courseType: 'DEPARTMENT_ELECTIVE',
      department: 'MTH',
    },
  ]

  for (const course of courses) {
    await prisma.course.create({ data: course })
  }

  console.log('Courses seeded!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
