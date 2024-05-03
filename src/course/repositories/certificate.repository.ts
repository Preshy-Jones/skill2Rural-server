import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CertificateRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CertificateCreateInput) {
    return this.prisma.certificate.create({
      data,
    });
  }

  async certificate(
    where: Prisma.CertificateWhereInput,
    includes?: Prisma.CertificateInclude,
  ) {
    return this.prisma.certificate.findMany({
      where,
      ...(includes && { include: includes }),
    });
  }
}
