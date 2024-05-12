import { Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { CourseModule } from "src/course/course.module";
import { CourseService } from "src/course/course.service";
import { CourseProgressService } from "src/course-progress/course-progress.service";
import { CourseProgressRepository } from "src/course-progress/repositories/course-progress.repository";
import { PrismaService } from "src/prisma.service";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseReviewRepository } from "src/course/repositories/review.repositories";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { CertificateRepository } from "./repositories/certificate.repository";
import { CourseProgressModule } from "src/course-progress/course-progress.module";

@Module({
  imports: [CourseModule, CourseProgressModule],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    CourseService,
    CourseProgressService,
    CourseProgressRepository,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
    CourseQuestionRepository,
    CertificateRepository,
  ],
})
export class QuestionModule {}
