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
  ): Promise<Certificate | null> {
    return this.prisma.certificate.findFirst({
      where,
    });
  }

  async countCertificates(where?: Prisma.CertificateWhereInput) {
    return this.prisma.certificate.count({
      where,
    });
  }

  async groupByCertificate(
    by: Prisma.CertificateScalarFieldEnum,
    where: Prisma.CertificateWhereInput,
    count?: Prisma.CertificateCountAggregateInputType,
    orderBy?: Prisma.CertificateOrderByWithAggregationInput,
  ) {
    return this.prisma.certificate.groupBy({
      by: [by],
      where,
      ...(count && { _count: count }),
      ...(orderBy && { orderBy }),
    });
  }
}
