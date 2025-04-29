-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "totals" DECIMAL(65,30)[],
ADD COLUMN     "weights" DECIMAL(65,30)[];

-- AlterTable
ALTER TABLE "CourseRegistration" ADD COLUMN     "marks" DECIMAL(65,30)[];
