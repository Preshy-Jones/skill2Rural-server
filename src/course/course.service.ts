import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { PrismaService } from "src/prisma.service";
import { CourseRepository } from "./repositories/course.repository";
import { successResponse } from "src/common/utils";
import { CourseReviewRepository } from "./repositories/review.repositories";
import { AddCourseReviewDto } from "./dto/add-course-review.dto";
import { AddQuestionDto } from "./dto/add-question.dto";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { QuizRepository } from "./repositories/quiz.repository.dto";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CertificateRepository } from "./repositories/certificate.repository";

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private courseRepository: CourseRepository,
    private courseReviewRepository: CourseReviewRepository,
    private courseQuestionRepository: CourseQuestionRepository,
    private quizRepository: QuizRepository,
    private certificateRepository: CertificateRepository,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courseRepository.create(createCourseDto);
  }

  async findAll() {
    try {
      const courses = await this.courseRepository.findAll();
      return successResponse(courses, "Courses retrieved successfully");
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      if (!course) {
        throw new HttpException("Course not found", 404);
      }
      return successResponse(course, "Course retrieved successfully");
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
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      // check if user has already reviewed the course
      const userReview =
        await this.courseReviewRepository.findReviewByCourseIdAndUserId(
          courseId,
          userId,
        );

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

  async addNewQuestion(courseId: number, data: AddQuestionDto) {
    try {
      // check if course exists
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      const question = await this.courseQuestionRepository.create({
        ...data,
        course: {
          connect: {
            id: courseId,
          },
        },
      });

      return successResponse(question, "Question added successfully");
    } catch (error) {
      throw error;
    }
  }

  async getQuestions(courseId: number) {
    try {
      // check if course exists
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      const questions = await this.courseQuestionRepository.courseQuestion({
        courseId,
      });

      return successResponse(questions, "Questions retrieved successfully");
    } catch (error) {
      throw error;
    }
  }

  // async submitQuiz(courseId: number, data: SubmitQuizDto) {
  //   try {
  //     const course = await this.courseRepository.findOne({
  //       where: { id: courseId },
  //     });

  //     if (!course) {
  //       throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
  //     }

  //     // check if user has already submitted the quiz
  //     const userQuiz = await this.quizRepository.quiz(
  //       {
  //         courseId,
  //         userId: data.userId,
  //       },
  //       {
  //         user: true,
  //       },
  //     );

  //     if (userQuiz.length > 0) {
  //       throw new HttpException(
  //         "You have already submitted the quiz",
  //         HttpStatus.CONFLICT,
  //       );
  //     }

  //     const quiz = await this.quizRepository.create({
  //       ...data,
  //       course: {
  //         connect: {
  //           id: courseId,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async createCertificate(
    courseId: number,
    userId: number,
    createCertificateDto: CreateCertificateDto,
  ) {
    try {
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      const certificate = await this.certificateRepository.create({
        ...createCertificateDto,
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

      return successResponse(certificate, "Certificate created successfully");
    } catch (error) {
      throw error;
    }
  }

  async getUserCertificates(userId: number) {
    try {
      const certificates = await this.certificateRepository.certificate({
        userId,
      });

      return successResponse(
        certificates,
        "Certificates retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserCertificate(courseId: number, userId: number) {
    try {
      const certificate = await this.certificateRepository.certificate(
        {
          courseId,
          userId,
        },
        {
          course: true,
        },
      );

      if (certificate.length === 0) {
        throw new HttpException("Certificate not found", HttpStatus.NOT_FOUND);
      }

      return successResponse(certificate, "Certificate retrieved successfully");
    } catch (error) {
      throw error;
    }
  }
}
