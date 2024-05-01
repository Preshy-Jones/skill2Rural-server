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

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findOne(params: {
    where: {
      id: number;
    };
  }) {
    const { where } = params;
    return this.prisma.course.findUnique({
      where,
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
