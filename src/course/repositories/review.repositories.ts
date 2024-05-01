import { Injectable } from "@nestjs/common";
import { CourseReview, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseReviewRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseReviewCreateInput): Promise<CourseReview> {
    return this.prisma.courseReview.create({
      data,
    });
  }

  async courseReviews(
    where: Prisma.CourseReviewWhereInput,
    include?: Prisma.CourseReviewInclude,
  ) {
    return this.prisma.courseReview.findMany({
      where,
      ...(include && { include }),
    });
  }

  async courseReviewsCount(where: Prisma.CourseReviewWhereInput) {
    return this.prisma.courseReview.count({
      where,
    });
  }

  async courseReviewGroupBy(
    by: Prisma.CourseReviewScalarFieldEnum,
    where: Prisma.CourseReviewWhereInput,
    count?: Prisma.CourseReviewCountAggregateInputType,
  ) {
    return this.prisma.courseReview.groupBy({
      by: [by],
      orderBy: {
        rating: "desc",
      },
      where,
      ...(count && { _count: count }),
    });
  }

  async findAll() {
    return this.prisma.courseReview.findMany();
  }

  async findOne(params: {
    where: {
      id: number;
    };
  }) {
    const { where } = params;
    return this.prisma.courseReview.findUnique({
      where,
    });
  }

  async update(params: {
    where: {
      id: number;
    };
    data: any;
  }) {
    const { where, data } = params;
    return this.prisma.courseReview.update({
      data,
      where,
    });
  }

  async remove(params: {
    where: {
      id: number;
    };
  }) {
    const { where } = params;
    return this.prisma.courseReview.delete({
      where,
    });
  }

  async findReviewsByCourseId(courseId: number) {
    return this.prisma.courseReview.findMany({
      where: {
        courseId,
      },
    });
  }

  async findReviewsByUserId(userId: number) {
    return this.prisma.courseReview.findMany({
      where: {
        userId,
      },
    });
  }

  async findReviewByCourseIdAndUserId(courseId: number, userId: number) {
    return this.prisma.courseReview.findFirst({
      where: {
        courseId,
        userId,
      },
    });
  }

  async findReviewByCourseIdAndUserIdAndId(
    courseId: number,
    userId: number,
    id: number,
  ) {
    return this.prisma.courseReview.findFirst({
      where: {
        courseId,
        userId,
        id,
      },
    });
  }

  async findReviewsByCourseIdAndRating(courseId: number, rating: number) {
    return this.prisma.courseReview.findMany({
      where: {
        courseId,
        rating,
      },
    });
  }

  async findReviewsByUserIdAndRating(userId: number, rating: number) {
    return this.prisma.courseReview.findMany({
      where: {
        userId,
        rating,
      },
    });
  }

  async findReviewsByCourseIdAndUserIdAndRating(
    courseId: number,
    userId: number,
    rating: number,
  ) {
    return this.prisma.courseReview.findMany({
      where: {
        courseId,
        userId,
        rating,
      },
    });
  }
}
