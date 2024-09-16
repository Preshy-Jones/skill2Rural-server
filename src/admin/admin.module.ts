import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./repositories/admin.repository";
import { PrismaService } from "src/prisma.service";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseQuestionRepository } from "src/course/repositories/question.repository";
import { CertificateRepository } from "src/course/repositories/certificate.repository";

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    PrismaService,
    CourseRepository,
    CourseQuestionRepository,
    CertificateRepository,
  ],
})
export class AdminModule {}
