import { Injectable } from "@nestjs/common";
import { Admin, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  async admins(where: Prisma.AdminWhereInput, skip?: number, take?: number) {
    return this.prisma.admin.findMany({
      where,
      ...(skip && { skip }),
      ...(take && { take }),
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: {
        email,
      },
    });
  }
  async create(data: Prisma.AdminCreateInput): Promise<Admin> {
    return this.prisma.admin.create({
      data,
    });
  }
  async update(params: {
    where: Prisma.AdminWhereUniqueInput;
    data: Prisma.AdminUpdateInput;
  }): Promise<Admin> {
    const { where, data } = params;
    return this.prisma.admin.update({
      data,
      where,
    });
  }

  async findOne(where: Prisma.AdminWhereUniqueInput): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where,
    });
  }

  async findAll() {
    return this.prisma.admin.findMany();
  }

  async count(where: Prisma.AdminWhereInput) {
    return this.prisma.admin.count({ where });
  }
}
