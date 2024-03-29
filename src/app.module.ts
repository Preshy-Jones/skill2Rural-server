import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { EducatorModule } from './educator/educator.module';

@Module({
  imports: [AuthModule, UserModule, EducatorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
