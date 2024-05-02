-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('TRUE', 'FALSE');

-- CreateTable
CREATE TABLE "CourseQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" "Answer" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CourseQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseQuestion" ADD CONSTRAINT "CourseQuestion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
