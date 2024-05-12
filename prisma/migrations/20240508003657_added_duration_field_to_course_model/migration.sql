/*
  Warnings:

  - You are about to drop the column `progress` on the `CourseProgress` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastWatchedTime` to the `CourseProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progressPercentage` to the `CourseProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CourseProgress" DROP COLUMN "progress",
ADD COLUMN     "lastWatchedTime" INTEGER NOT NULL,
ADD COLUMN     "progressPercentage" INTEGER NOT NULL;
