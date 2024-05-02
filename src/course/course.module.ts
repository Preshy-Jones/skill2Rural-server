import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseRepository } from "./repositories/course.repository";
import { PrismaService } from "src/prisma.service";
import { CourseReviewRepository } from "./repositories/review.repositories";
import { CourseQuestionRepository } from "./repositories/question.repository";

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
    CourseQuestionRepository,
  ],
})
export class CourseModule {}
