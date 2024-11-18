import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateCourseProgressDto } from "./dto/update-course-progress.dto";
import { CourseProgressRepository } from "./repositories/course-progress.repository";
import { CourseService } from "src/course/course.service";
import { successResponse } from "src/common/utils";
import { Prisma } from "@prisma/client";

@Injectable()
export class CourseProgressService {
  constructor(
    private courseProgressRepository: CourseProgressRepository,
    private courseService: CourseService,
  ) {}
  async updateCourseProgress(
    updateCourseProgressDto: UpdateCourseProgressDto,
    userId: number,
    courseId: number,
  ) {
    try {
      //check if course exists
      const course = await this.courseService.getSingleCourse(courseId, userId);

      //check if course progress exists
      const courseProgress =
        await this.courseProgressRepository.findCourseProgress({
          courseId: courseId,
          userId,
        });

      const lastWatchedTime = updateCourseProgressDto.current_time;

      const progressPercentage = (lastWatchedTime / course.data.duration) * 100;

      //check if progressPercentage is greater than the current progress percentage
      if (
        courseProgress &&
        progressPercentage < courseProgress.progressPercentage
      ) {
        return successResponse(
          {
            lastWatchedTime: courseProgress.lastWatchedTime,
            progressPercentage: courseProgress.progressPercentage,
          },
          "Course progress updated successfully",
        );
      }

      if (!courseProgress) {
        await this.courseProgressRepository.create({
          lastWatchedTime,
          progressPercentage,
          user: {
            connect: {
              id: userId,
            },
          },
          course: {
            connect: {
              id: courseId,
            },
          },
        });

        return successResponse(
          { lastWatchedTime, progressPercentage },
          "Course progress updated successfully",
        );
      }
      const completionPercentage = 90;
      const updateCourseProgressPayload: Prisma.CourseProgressUpdateInput = {
        lastWatchedTime,
        progressPercentage,
      };
      if (Number(progressPercentage) >= completionPercentage) {
        updateCourseProgressPayload.completedDateTime = new Date();
      }
      await this.courseProgressRepository.updateCourseProgress(
        updateCourseProgressPayload,
        {
          id: courseProgress.id,
        },
      );

      return successResponse(
        { lastWatchedTime, progressPercentage },
        "Course progress updated successfully",
      );
    } catch (error) {
      throw error;
    }
  }

  async getCourseProgress(userId: number, courseId: number) {
    try {
      //check if course exists
      const course = await this.courseService.getSingleCourse(courseId, userId);

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      //check if course progress exists
      const courseProgress =
        await this.courseProgressRepository.findCourseProgress({
          courseId: courseId,
          userId,
        });

      if (!courseProgress) {
        throw new HttpException(
          "Course progress not found",
          HttpStatus.NOT_FOUND,
        );
      }

      return successResponse(
        courseProgress,
        "Course progress retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }
}
