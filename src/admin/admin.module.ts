import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController, AdminCourseController } from "./admin.controller";
import { AdminRepository } from "./repositories/admin.repository";
import { PrismaService } from "src/prisma.service";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseQuestionRepository } from "src/course/repositories/question.repository";
import { CertificateRepository } from "src/course/repositories/certificate.repository";
import { QuestionModule } from "src/question/question.module";
import { UserRepository } from "src/user/repositories/user.repository";
import { CourseProgressRepository } from "src/course-progress/repositories/course-progress.repository";
import { QuizRepository } from "src/question/repositories/quiz.repository.dto";

@Module({
  imports: [QuestionModule],
  controllers: [AdminController, AdminCourseController],
  providers: [
    AdminService,
    AdminRepository,
    PrismaService,
    CourseRepository,
    CourseQuestionRepository,
    CertificateRepository,
    UserRepository,
    CourseProgressRepository,
    QuizRepository,
  ],
  exports: [AdminService],
})
export class AdminModule {}
