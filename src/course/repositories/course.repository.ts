import { Injectable } from "@nestjs/common";
import { Course, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    return this.prisma.course.create({
      data,
    });
  }

  async coursesSelect(
    where: Prisma.CourseWhereInput,
    select: Prisma.CourseSelect,
  ) {
    return this.prisma.course.findMany({
      where,
      select,
    });
  }

  async courses(
    where: Prisma.CourseWhereInput,
    include?: Prisma.CourseInclude,
  ) {
    return this.prisma.course.findMany({
      where,
      ...(include && { include }),
    });
  }

  async findOne(
    where: Prisma.CourseWhereUniqueInput,
    include?: Prisma.CourseInclude,
  ) {
    return this.prisma.course.findUnique({
      where,
      ...(include && { include }),
    });
  }

  async update(params: {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.CourseUpdateInput;
  }): Promise<Course | null> {
    const { where, data } = params;
    return this.prisma.course.update({
      data,
      where,
    });
  }

  async remove(params: {
    where: {
      id: number;
    };
  }) {
    const { where } = params;
    return this.prisma.course.delete({
      where,
    });
  }
}
