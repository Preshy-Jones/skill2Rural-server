/*
  Warnings:

  - The values [ADMIN] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('STUDENT', 'EDUCATOR');
ALTER TABLE "User" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
ALTER TABLE "User" ALTER COLUMN "type" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "CourseProgress" ADD COLUMN     "completedDateTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "country",
DROP COLUMN "role";
