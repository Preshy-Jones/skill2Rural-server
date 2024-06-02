import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseRepository } from "./repositories/course.repository";
import { PrismaService } from "src/prisma.service";
import { CourseReviewRepository } from "./repositories/review.repositories";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { CertificateRepository } from "./repositories/certificate.repository";

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    PrismaService,
    CourseRepository,
    CourseReviewRepository,
    CourseQuestionRepository,
    CertificateRepository,
  ],
  exports: [
    CourseService,
    CourseRepository,
    CourseQuestionRepository,
    CertificateRepository,
  ],
})
export class CourseModule {}
