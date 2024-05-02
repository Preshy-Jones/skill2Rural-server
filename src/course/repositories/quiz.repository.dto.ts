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

  async quiz(where: Prisma.QuizWhereInput, includes?: Prisma.QuizInclude) {
    return this.prisma.quiz.findMany({
      where,
      ...(includes && { include: includes }),
    });
  }
}
