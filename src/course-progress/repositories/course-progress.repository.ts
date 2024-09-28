import { Injectable } from "@nestjs/common";
import { CourseProgress, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class CourseProgressRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseProgressCreateInput) {
    return this.prisma.courseProgress.create({
      data,
    });
  }

  async courseProgress(
    where: Prisma.CourseProgressWhereInput,
    includes?: Prisma.CourseProgressInclude,
  ) {
    return this.prisma.courseProgress.findMany({
      where,
      ...(includes && { include: includes }),
    });
  }

  async updateCourseProgress(
    data: Prisma.CourseProgressUpdateInput,
    where: Prisma.CourseProgressWhereUniqueInput,
  ): Promise<CourseProgress | null> {
    return this.prisma.courseProgress.update({
      data,
      where,
    });
  }

  async findCourseProgress(
    where: Prisma.CourseProgressWhereInput,
  ): Promise<CourseProgress | null> {
    return this.prisma.courseProgress.findFirst({
      where,
    });
  }

  async getCourseCompletionsPerCourse() {
    const courseCompletions = await this.prisma.courseProgress.groupBy({
      by: ["courseId"],
      _count: {
        _all: true,
      },
      where: {
        progressPercentage: {
          gt: 90, // Filter for progress greater than 90
        },
      },
    });

    // Fetch the course titles for each courseId and format the result
    const formattedResult = await Promise.all(
      courseCompletions.map(async (completion) => {
        const course = await this.prisma.course.findUnique({
          where: { id: completion.courseId },
          select: { title: true }, // Only fetch the title
        });

        return {
          title: course?.title || "Unknown Course", // If the course doesn't exist, handle it gracefully
          numberOfCourseCompletions: completion._count._all,
        };
      }),
    );

    return formattedResult;
  }

  async getCourseCompletionsPerUserType() {
    // Get the total number of course completions
    const totalCompletions = await this.prisma.courseProgress.count({
      where: {
        progressPercentage: {
          gt: 90, // Filter for completed courses (progress > 90%)
        },
      },
    });

    // Get the number of completions for STUDENT users
    const studentCompletions = await this.prisma.courseProgress.count({
      where: {
        progressPercentage: {
          gt: 90,
        },
        user: {
          type: "STUDENT",
        },
      },
    });

    // Get the number of completions for EDUCATOR users
    const educatorCompletions = await this.prisma.courseProgress.count({
      where: {
        progressPercentage: {
          gt: 90,
        },
        user: {
          type: "EDUCATOR",
        },
      },
    });

    // Calculate the completion rates
    const studentCompletionRate = (studentCompletions / totalCompletions) * 100;
    const educatorCompletionRate =
      (educatorCompletions / totalCompletions) * 100;

    return {
      studentCompletionRate: studentCompletionRate.toFixed(2) + "%",
      educatorCompletionRate: educatorCompletionRate.toFixed(2) + "%",
    };
  }

  async countCourseProgress(where?: Prisma.CourseProgressWhereInput) {
    return this.prisma.courseProgress.count({
      where,
    });
  }
}
