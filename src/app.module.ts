import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from "./prisma.service";
import { EducatorModule } from "./educator/educator.module";
import { CourseModule } from "./course/course.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { MailModule } from "./mail/mail.module";
import { CourseProgressModule } from "./course-progress/course-progress.module";
import { QuestionModule } from "./question/question.module";
import { UploadModule } from "./upload/upload.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    AuthModule,
    UserModule,
    EducatorModule,
    CourseModule,
    MailModule,
    CourseProgressModule,
    QuestionModule,
    UploadModule,
    ConfigModule.forRoot({
      // load: [configuration],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
