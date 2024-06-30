import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { successResponse } from "src/common/utils";
import { AddQuestionDto } from "src/course/dto/add-question.dto";
import { CourseService } from "src/course/course.service";
import { CertificateRepository } from "./repositories/certificate.repository";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseQuestionRepository } from "./repositories/question.repository";
import { CourseProgressRepository } from "src/course-progress/repositories/course-progress.repository";
import { ProcessQuizDto } from "./dto/process-quiz.dto";
import { QuizRepository } from "./repositories/quiz.repository.dto";

@Injectable()
export class QuestionService {
  constructor(
    private courseService: CourseService,
    private certificateRepository: CertificateRepository,
    private courseRepository: CourseRepository,
    private courseQuestionRepository: CourseQuestionRepository,
    private courseProgressRepository: CourseProgressRepository,
    private quizRepository: QuizRepository,
  ) {}

  async addNewQuestion(courseId: number, data: AddQuestionDto) {
    try {
      // check if course exists
      const course = await this.courseRepository.findOne({
        id: courseId,
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

  async getQuestions(courseId: number, userId: number) {
    try {
      // let shouldUserTakeQuiz = true;
      // check if course exists
      const course = await this.courseRepository.findOne({
        id: courseId,
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      const questions = await this.courseQuestionRepository.courseQuestion({
        courseId,
      });

      //check if user has already been issued a certificate for the course
      const userCertificate = await this.certificateRepository.findCertificate({
        courseId,
        userId,
      });

      if (userCertificate) {
        throw new HttpException(
          "You have already been passed the quiz for this course",
          HttpStatus.CONFLICT,
        );
      }

      //check if user's progress is 100%
      const userProgress =
        await this.courseProgressRepository.findCourseProgress({
          courseId,
          userId,
        });

      if (!userProgress) {
        throw new HttpException(
          "You have not completed this course",
          HttpStatus.FORBIDDEN,
        );
      }

      if (userProgress.progressPercentage < 90) {
        throw new HttpException(
          "You have not completed this course",
          HttpStatus.FORBIDDEN,
        );
      }

      return successResponse(questions, "Questions retrieved successfully");
    } catch (error) {
      throw error;
    }
  }

  async processQuiz(
    courseId: number,
    userId: number,
    processQuizDto: ProcessQuizDto,
  ) {
    try {
      const course = await this.courseService.getSingleCourse(courseId, userId);

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      //check if user has already been issued a certificate for the course
      const userCertificate = await this.certificateRepository.findCertificate({
        courseId,
        userId,
      });

      if (userCertificate) {
        throw new HttpException(
          "You have already been issued a certificate for this course",
          HttpStatus.CONFLICT,
        );
      }

      let passed = false;

      //create quiz
      await this.quizRepository.create({
        ...processQuizDto,
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

      if (processQuizDto.gradeInPercentage >= 70) {
        await this.certificateRepository.create({
          ...processQuizDto,
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
        passed = true;
      } else {
      }

      return successResponse(
        {
          passed,
          gradeInPercentage: processQuizDto.gradeInPercentage,
        },
        "Quiz processed successfully",
      );
    } catch (error) {
      throw error;
    }
  }
  async getUserCertificate(courseId: number, userId: number) {
    try {
      const certificate = await this.certificateRepository.findCertificate(
        {
          courseId,
          userId,
        },
        {
          course: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_photo: true,
            },
          },
        },
      );

      if (!certificate) {
        throw new HttpException("Certificate not found", HttpStatus.NOT_FOUND);
      }

      return successResponse(certificate, "Certificate retrieved successfully");
    } catch (error) {
      throw error;
    }
  }
  async getUserCertificates(userId: number) {
    try {
      const certificates = await this.certificateRepository.certificate(
        {
          userId,
        },
        {
          course: {
            include: {
              progress: true,
            },
          },
        },
      );

      // get all courses where the user is enrolled
      const courses = await this.courseRepository.courses({
        progress: {
          some: {
            userId,
          },
        },
      });

      //get number of courses completed course in which the user has a certificate
      const number_of_completed_courses =
        await this.certificateRepository.countCertificates({
          userId,
        });

      return successResponse(
        {
          certificates,
          number_of_completed_courses,
          total_courses_enrolled: courses.length,
        },
        "Certificates retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserQuizResults(courseId: number, userId: number) {
    try {
      const quizResults = await this.quizRepository.quizes({
        courseId,
        userId,
      });

      return successResponse(
        quizResults,
        "Quiz results retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserBestQuizResult(courseId: number, userId: number) {
    try {
      const bestQuiz = await this.quizRepository.quiz(
        {
          courseId,
          userId,
        },
        {},
        {
          gradeInPercentage: "desc",
        },
      );

      return successResponse(
        bestQuiz,
        "Best quiz result retrieved successfully",
      );
    } catch (error) {
      throw error;
    }
  }
}
