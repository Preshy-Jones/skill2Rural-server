import { Injectable } from "@nestjs/common";
import { Prisma, AccountRecovery } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountRecoveryRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.AccountRecoveryCreateInput,
  ): Promise<AccountRecovery> {
    return this.prisma.accountRecovery.create({ data });
  }

  async findUnique(
    where: Prisma.AccountRecoveryWhereUniqueInput,
  ): Promise<AccountRecovery | null> {
    return this.prisma.accountRecovery.findUnique({ where });
  }

  async findFirst(
    where: Prisma.AccountRecoveryWhereInput,
  ): Promise<AccountRecovery | null> {
    return this.prisma.accountRecovery.findFirst({ where });
  }

  async update(
    where: Prisma.AccountRecoveryWhereUniqueInput,
    data: Prisma.AccountRecoveryUpdateInput,
  ): Promise<AccountRecovery> {
    return this.prisma.accountRecovery.update({ where, data });
  }

  async delete(
    where: Prisma.AccountRecoveryWhereUniqueInput,
  ): Promise<AccountRecovery> {
    return this.prisma.accountRecovery.delete({ where });
  }
}
