import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseRepository } from "./repositories/course.repository";
import { PrismaService } from "src/prisma.service";
import { CourseReviewRepository } from "./repositories/review.repositories";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { QuizRepository } from "./repositories/quiz.repository.dto";
import { CertificateRepository } from "./repositories/certificate.repository";

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
    CourseQuestionRepository,
    QuizRepository,
    CertificateRepository,
  ],
})
export class CourseModule {}
