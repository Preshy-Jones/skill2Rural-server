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

  async getUsersForEachMonth() {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const usersPerMonth = await this.prisma.user.groupBy({
      by: ["createdAt"],
      _count: {
        _all: true,
      },
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Aggregate the result by month
    const monthlyUsers = Array(12).fill(0); // To represent each month (Jan - Dec)

    usersPerMonth.forEach((user) => {
      const month = new Date(user.createdAt).getMonth(); // Get month index (0 = Jan, 11 = Dec)
      monthlyUsers[month] += user._count._all;
    });

    // Return the result with proper month names
    return monthlyUsers.map((count, index) => ({
      month: monthNames[index], // Convert index to month name
      userCount: count,
    }));
  }
}
