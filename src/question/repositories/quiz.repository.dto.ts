import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class QuizRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuizCreateInput) {
    return this.prisma.quiz.create({
      data,
    });
  }

  async quizes(where: Prisma.QuizWhereInput, includes?: Prisma.QuizInclude) {
    return this.prisma.quiz.findMany({
      where,
      ...(includes && { include: includes }),
    });
  }

  async countQuizes(where?: Prisma.QuizWhereInput) {
    return this.prisma.quiz.count({
      where,
    });
  }

  async uniqueQuiz(
    where: Prisma.QuizWhereUniqueInput,
    includes?: Prisma.QuizInclude,
  ) {
    return this.prisma.quiz.findUnique({
      where,
      ...(includes && { include: includes }),
    });
  }

  async quiz(
    where: Prisma.QuizWhereInput,
    includes?: Prisma.QuizInclude,
    orderBy?: Prisma.QuizOrderByWithAggregationInput,
  ) {
    return this.prisma.quiz.findFirst({
      where,
      ...(includes && { include: includes }),
      orderBy,
    });
  }
}
