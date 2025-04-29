-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('A_STAR', 'A', 'B', 'C', 'D', 'E', 'F');

-- AlterTable
ALTER TABLE "CourseRegistration" ADD COLUMN     "grade" "Grade";
