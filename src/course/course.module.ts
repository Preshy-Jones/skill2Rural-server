import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseRepository } from "./repositories/course.repository";
import { PrismaService } from "src/prisma.service";
import { CourseReviewRepository } from "./repositories/review.repositories";

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
  ],
})
export class CourseModule {}
