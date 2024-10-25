import { Injectable } from "@nestjs/common";
import { Course, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput) {
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
    skip?: number,
    take?: number,
  ) {
    return this.prisma.course.findMany({
      where,
      ...(include && { include }),
      ...(skip && { skip }),
      ...(take && { take }),
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

  async countCourses(where?: Prisma.CourseWhereInput) {
    return this.prisma.course.count({
      where,
    });
  }

  async coursesGroupBy(
    by: Prisma.CourseScalarFieldEnum,
    where: Prisma.CourseWhereInput,
    count?: Prisma.CourseCountAggregateInputType,
    orderBy?: Prisma.CourseOrderByWithAggregationInput,
  ) {
    return this.prisma.course.groupBy({
      by: [by],
      orderBy: {
        createdAt: "desc",
      },
      where,
      ...(count && { _count: count }),
      ...(orderBy && { orderBy }),
    });
  }
}
