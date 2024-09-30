import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User | null> {
    const { where } = params;
    return this.prisma.user.findUnique({
      where,
    });
  }

  uniqueUser(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
      ...(include && { include }),
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where });
  }

  async userGroupBy(
    by: Prisma.UserScalarFieldEnum,
    where: Prisma.UserWhereInput,
    count?: Prisma.UserCountAggregateInputType,
    orderBy?: Prisma.UserOrderByWithAggregationInput,
  ) {
    return this.prisma.user.groupBy({
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
