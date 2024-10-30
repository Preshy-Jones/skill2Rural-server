import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async users(
    where: Prisma.UserWhereInput,
    skip?: number,
    take?: number,
    search?: string,
  ) {
    if (search) {
      where = {
        ...where,
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }
    return this.prisma.user.findMany({
      where,
      ...(skip && { skip }),
      ...(take && { take }),
    });
  }
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

  async count(where?: Prisma.UserWhereInput, search?: string) {
    if (search) {
      where = {
        ...where,
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }
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

  async sumNoOfStudentsReachedByEducators() {
    const sum = this.prisma.user.aggregate({
      _sum: {
        no_of_students_to_reach: true,
      },
    });

    return (await sum)._sum.no_of_students_to_reach;
  }
}
