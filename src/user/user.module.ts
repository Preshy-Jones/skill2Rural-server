import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../prisma.service";
import { UserRepository } from "./repositories/user.repository";
import { AccountRecoveryRepository } from "./repositories/accountRecovery.repository";
import { MailModule } from "src/mail/mail.module";
import { MailService } from "src/mail/mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UploadModule } from "src/upload/upload.module";
import { UploadService } from "src/upload/upload.service";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    MailService,
    PrismaService,
    UserRepository,
    AccountRecoveryRepository,
    UploadService,
  ],
  imports: [
    UploadModule,
    MailModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "3h" },
      }),
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
