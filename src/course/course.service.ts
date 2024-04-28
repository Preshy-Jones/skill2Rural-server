import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private courseRepository: CourseRepository,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courseRepository.create(createCourseDto);
  }

  findAll() {
    return this.courseRepository.findAll();
  }

  findOne(id: number) {
    return this.courseRepository.findOne({ where: { id } });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  remove(id: number) {
    return this.courseRepository.remove({ where: { id } });
  }
}
