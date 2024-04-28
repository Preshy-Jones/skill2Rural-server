import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService, CourseRepository],
})
export class CourseModule {}
