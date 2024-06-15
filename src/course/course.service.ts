import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { PrismaService } from "src/prisma.service";
import { CourseRepository } from "./repositories/course.repository";
import { successResponse } from "src/common/utils";
import { CourseReviewRepository } from "./repositories/review.repositories";
import { AddCourseReviewDto } from "./dto/add-course-review.dto";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { CertificateRepository } from "./repositories/certificate.repository";
import { Course } from "@prisma/client";

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private courseRepository: CourseRepository,
    private courseReviewRepository: CourseReviewRepository,
    private courseQuestionRepository: CourseQuestionRepository,

    private certificateRepository: CertificateRepository,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courseRepository.create(createCourseDto);
  }

  async findAll() {
    try {
      const courses = await this.courseRepository.coursesSelect(
        {},
        {
          id: true,
          title: true,
          description: true,
          thumbnail_image: true,
          createdAt: true,
          updatedAt: true,
        },
      );
      return successResponse(courses, "Courses retrieved successfully");
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const course = await this.courseRepository.findOne({
        id,
      });
      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      return successResponse(course, "Course retrieved successfully");
    } catch (error) {
      throw error;
    }
  }

  async getSingleCourse(
    id: number,
    userId: number,
  ): Promise<{
    data: Course;
    message: string;
  }> {
    try {
      // find course include course progress which has the userId
      const course = await this.courseRepository.findOne(
        {
          id,
        },
        {
          progress: {
            where: {
              userId,
            },
          },
        },
      );
      if (!course) {
        throw new HttpException("Course not found", 404);
      }
      return successResponse(course, "Course retrieved successfully");
    } catch (error) {
      throw error;
    }
  }
  async getUserEnrolledCourses(userId: number): Promise<{
    data: Course[];
    message: string;
  }> {
    try {
      // get all courses where the user is enrolled
      const courses = await this.courseRepository.courses(
        {
          progress: {
            some: {
              userId,
            },
          },
        },
        {
          progress: true,
        },
      );

      //get number of courses completed course in which the user has a certificate
      const number_of_completed_courses =
        await this.certificateRepository.countCertificates({
          userId,
        });

      return successResponse(
        {
          courses,
          number_of_completed_courses,
          total_courses_enrolled: courses.length,
        },
        "Courses retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  remove(id: number) {
    return this.courseRepository.remove({ where: { id } });
  }

  async addCourseReview(
    courseId: number,
    userId: number,
    data: AddCourseReviewDto,
  ) {
    try {
      // check if course exists
      const course = await this.courseRepository.findOne(
        {
          id: courseId,
        },
        {
          progress: {
            where: {
              userId,
            },
          },
        },
      );

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      // check if user has already reviewed the course
      const userReview =
        await this.courseReviewRepository.findReviewByCourseIdAndUserId(
          courseId,
          userId,
        );

      //check if course progress is up to 90 %
      if (course.progress[0].progressPercentage < 90) {
        throw new HttpException(
          "You must complete the course before you can review it",
          HttpStatus.FORBIDDEN,
        );
      }

      if (userReview) {
        throw new HttpException(
          "You have already reviewed this course",
          HttpStatus.CONFLICT,
        );
      }

      const review = await this.courseReviewRepository.create({
        ...data,
        course: {
          connect: {
            id: courseId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      });

      return successResponse(review, "Review added successfully");
    } catch (error) {
      throw error;
    }
  }

  async findReviewsByCourseId(courseId: number) {
    try {
      const ratingRange = [1, 2, 3, 4, 5];
      // get all reviews for a course and include the user data from the user table
      const reviews = await this.courseReviewRepository.courseReviews(
        {
          courseId,
        },
        {
          user: true,
        },
      );

      if (reviews.length === 0) {
        return successResponse(
          { reviews, averageRating: 0, ratings: [] },
          "No reviews found",
        );
      }

      // get the average rating
      const averageRating = (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(2);

      // get percentage of the number of each rating over the total number of reviews
      const reviewsGroupedByRating =
        await this.courseReviewRepository.courseReviewGroupBy(
          "rating",
          {
            rating: {
              in: ratingRange,
            },
            courseId,
          },
          {
            _all: true,
          },
        );

      const totalCourseReviews = reviews.length;

      const distribution = reviewsGroupedByRating.map((group) => {
        return {
          rating: group.rating,
          percentage: Number(
            ((group._count._all / totalCourseReviews) * 100).toFixed(2),
          ),
        };
      });

      const rating = [5, 4, 3, 2, 1];
      const ratings = rating.map((rate) => {
        const found = distribution.find((dist) => dist.rating === rate);
        return found ? found : { rating: rate, percentage: 0 };
      });

      return successResponse(
        { reviews, averageRating, ratings },
        "Reviews retrieved successfully",
      );

      return successResponse(reviews, "Reviews retrieved successfully");
    } catch (error) {
      throw error;
    }
  }
}
