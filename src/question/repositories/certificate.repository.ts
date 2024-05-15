import { Injectable } from "@nestjs/common";
import { Certificate, Prisma } from "@prisma/client";
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

  async findCertificate(
    where: Prisma.CertificateWhereInput,
    includes?: Prisma.CertificateInclude,
  ): Promise<Certificate | null> {
    return this.prisma.certificate.findFirst({
      where,
      ...(includes && { include: includes }),
    });
  }

  async countCertificates(where: Prisma.CertificateWhereInput) {
    return this.prisma.certificate.count({
      where,
    });
  }
}
