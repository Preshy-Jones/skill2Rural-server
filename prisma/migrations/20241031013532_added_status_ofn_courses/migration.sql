-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'FREE';
