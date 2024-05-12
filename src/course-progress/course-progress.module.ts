import { Module } from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";
import { CourseProgressController } from "./course-progress.controller";
import { CourseModule } from "src/course/course.module";
import { CourseService } from "src/course/course.service";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseProgressRepository } from "./repositories/course-progress.repository";
import { PrismaService } from "src/prisma.service";
import { CourseReviewRepository } from "src/course/repositories/review.repositories";
import { CourseQuestionRepository } from "src/course/repositories/question.repository";
import { QuizRepository } from "src/course/repositories/quiz.repository.dto";
import { CertificateRepository } from "src/course/repositories/certificate.repository";

@Module({
  imports: [CourseModule],
  controllers: [CourseProgressController],
  providers: [
    CourseProgressService,
    CourseService,
    CourseProgressRepository,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
    CourseQuestionRepository,
    QuizRepository,
    CertificateRepository,
  ],
  exports: [CourseProgressService, CourseProgressRepository],
})
export class CourseProgressModule {}
