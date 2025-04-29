import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding data...");

  const courses = [
    { name: "Data Structures", code: "CSE101", courseType: "INSTITUTE_COMPULSORY", department: "CSE" },
    { name: "Algorithms", code: "CSE102", courseType: "DEPARTMENT_ELECTIVE", department: "CSE" },
    { name: "Digital Circuits", code: "EE101", courseType: "INSTITUTE_COMPULSORY", department: "EE" },
    { name: "Signals and Systems", code: "EE102", courseType: "DEPARTMENT_ELECTIVE", department: "EE" },
    { name: "Calculus", code: "MTH101", courseType: "INSTITUTE_COMPULSORY", department: "MTH" },
    { name: "Linear Algebra", code: "MTH102", courseType: "OPEN_ELECTIVE", department: "MTH" }
  ]

  for (const course of courses) {
    await prisma.course.create({
      data: {
        name: course.name,
        code: course.code,
        courseType: course.courseType,
        department: course.department,
        // ❌ No teacher assigned yet here.
      }
    })
  }

  console.log("Seeding complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

