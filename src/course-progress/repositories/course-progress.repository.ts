import { Injectable } from "@nestjs/common";
import { CourseProgress, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseProgressRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseProgressCreateInput) {
    return this.prisma.courseProgress.create({
      data,
    });
  }

  async courseProgress(
    where: Prisma.CourseProgressWhereInput,
    includes?: Prisma.CourseProgressInclude,
  ) {
    return this.prisma.courseProgress.findMany({
      where,
      ...(includes && { include: includes }),
    });
  }

  async updateCourseProgress(
    data: Prisma.CourseProgressUpdateInput,
    where: Prisma.CourseProgressWhereUniqueInput,
  ): Promise<CourseProgress | null> {
    return this.prisma.courseProgress.update({
      data,
      where,
    });
  }

  async findCourseProgress(
    where: Prisma.CourseProgressWhereInput,
  ): Promise<CourseProgress | null> {
    return this.prisma.courseProgress.findFirst({
      where,
    });
  }
}
