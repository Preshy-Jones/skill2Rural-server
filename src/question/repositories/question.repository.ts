import { Injectable } from "@nestjs/common";
import { CourseQuestion, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseQuestionRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.CourseQuestionCreateInput,
  ): Promise<CourseQuestion> {
    return this.prisma.courseQuestion.create({
      data,
    });
  }

  async courseQuestion(
    where: Prisma.CourseQuestionWhereInput,
    include?: Prisma.CourseQuestionInclude,
  ) {
    return this.prisma.courseQuestion.findMany({
      where,
      ...(include && { include }),
    });
  }

  async findMany() {
    return this.prisma.courseQuestion.findMany();
  }
}
