import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminRepository } from "./repositories/admin.repository";
import { CertificateRepository } from "src/course/repositories/certificate.repository";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "src/user/repositories/user.repository";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseProgressRepository } from "src/course-progress/repositories/course-progress.repository";
import { UserType } from "src/user/dto/create-educator.dto";
import { subMonths } from "date-fns";
import { QuizRepository } from "src/question/repositories/quiz.repository.dto";
import { CourseStatus, Period } from "src/common/global/interface";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { CreateCourseDto } from "./dto/create-course.dto";
import { InviteAdminDto } from "./dto/invite-admin.dto";
import { generatePassword, successResponse } from "src/common/utils";
import { MailService } from "src/mail/mail.service";
import { UploadService } from "src/upload/upload.service";
import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import * as ffprobeInstaller from "@ffprobe-installer/ffprobe";
import * as tmp from "tmp";
import * as fs from "fs";
import { CourseQuestionRepository } from "src/course/repositories/question.repository";
import { CreateCourseQuestionDto } from "./dto/create-course-question.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ChangePasswordDto } from "src/user/dto/changePassword.dto";
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";
import { UpdateAdminUserDto } from "./dto/update-admin.dto";
// import { getVideoDurationInSeconds } from "get-video-duration";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private certificateRepository: CertificateRepository,
    private userRepository: UserRepository,
    private courseProgressRepository: CourseProgressRepository,
    private courseRepository: CourseRepository,
    private quizRepository: QuizRepository,
    private courseQuestion: CourseQuestionRepository,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private uploadService: UploadService,
  ) {
    // ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    // ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  async create(createAdminDto: CreateAdminDto) {
    try {
      const { email, name, password } = createAdminDto;

      // Check if admin already exists
      const admin = await this.findByEmail(email);
      if (admin) {
        throw new HttpException(
          "Admin with that email already exists",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the admin
      const newAdmin = await this.adminRepository.create({
        email,
        name,
        password: hashedPassword,
      });

      return {
        email: newAdmin.email,
        id: newAdmin.id,
        name: newAdmin.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMe(adminUserId: number) {
    try {
      const admin = await this.adminRepository.findOne({ id: adminUserId });
      if (!admin) {
        throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(LoginAdminDto: LoginAdminDto) {
    try {
      return {
        message: "Login successful",
        data: {
          accessToken: this.jwtService.sign(
            { ...LoginAdminDto, isAdmin: true },
            {
              expiresIn: "1d",
            },
          ),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //update user
  async update(
    id: number,
    updateUserDto: UpdateAdminUserDto,
    profile_photo: Express.Multer.File,
  ) {
    try {
      //check if user exists
      const adminUser = await this.adminRepository.findOne({ id });

      if (!adminUser) {
        throw new HttpException("Admin User not found", HttpStatus.NOT_FOUND);
      }

      //check if profile photo exists
      if (profile_photo) {
        //upload profile photo
        const uploadedPhoto = await this.uploadService.s3UploadFile(
          profile_photo,
          "admin_profile_photos",
        );

        updateUserDto.profile_photo = uploadedPhoto.fileUrl;
      }

      return this.adminRepository.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async createQuestion(createCourseQuestionDto: CreateCourseQuestionDto) {
    try {
      const { question, options, answer, courseId, point } =
        createCourseQuestionDto;

      // Check if course exists
      const course = await this.courseRepository.findOne({ id: courseId });
      if (!course) {
        throw new HttpException(
          "Course does not exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create the question
      const newQuestion = await this.courseQuestion.create({
        question,
        options,
        answer,
        point,
        course: {
          connect: {
            id: course.id,
          },
        },
      });

      return {
        message: "Question created successfully",
        data: newQuestion,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCourseQuestions(courseId: string) {
    try {
      // Check if course exists
      const course = await this.courseRepository.findOne({
        id: Number(courseId),
      });
      if (!course) {
        throw new HttpException(
          "Course does not exist",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the questions for the course
      const questions = await this.courseQuestion.courseQuestions({
        courseId: Number(courseId),
      });

      return {
        message: "Questions retrieved successfully",
        data: questions,
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.adminRepository.findOneByEmail(email);
  }

  async dashboardAnalytics() {
    // get total users
    const totalUsers = await this.userRepository.count();

    // get total courses
    const totalCourses = await this.courseRepository.countCourses();

    // get total certificates
    const totalCertificates =
      await this.certificateRepository.countCertificates();

    // get users registered per month for bar chart
    const usersPerMonth = await this.getUsersForEachMonth();

    // get course completions for each course
    const courseCompletionsPerCourse =
      await this.courseProgressRepository.getCourseCompletionsPerCourse();

    // get course completions per user type
    const courseCompletionsPerUserType =
      await this.courseProgressRepository.getCourseCompletionsPerUserType();

    return {
      totalUsers,
      totalCourses,
      totalCertificates,
      usersPerMonth,
      courseCompletionsPerCourse,
      courseCompletionsPerUserType,
    };
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUsersStats() {
    // get total users
    const totalUsers = await this.userRepository.count();

    // Get the current date
    const currentDate = new Date();

    // Calculate the date one month ago
    const oneMonthAgo = subMonths(currentDate, 1);

    // Get the number of users created in the last month
    const usersLastMonth = await this.userRepository.count({
      createdAt: {
        lte: oneMonthAgo,
      },
    });

    // Calculate the percentage increase in total users from last month in 2 decimal places
    const percentageIncreaseInTotalUsers = parseFloat(
      (((totalUsers - usersLastMonth) / usersLastMonth) * 100).toFixed(2),
    );

    // get total educator users
    const totalEducators = await this.userRepository.count({
      type: UserType.Educator,
    });

    // Get the number of educators created in the last month
    const educatorsLastMonth = await this.userRepository.count({
      type: UserType.Educator,
      createdAt: {
        lte: oneMonthAgo,
      },
    });

    // Calculate the percentage increase in total educators from last month in 2 decimal places
    const percentageIncreaseInTotalEducators = parseFloat(
      (
        ((totalEducators - educatorsLastMonth) / educatorsLastMonth) *
        100
      ).toFixed(2),
    );

    // get total student users
    const totalStudents = await this.userRepository.count({
      type: UserType.Student,
    });

    // Get the number of students created in the last month
    const studentsLastMonth = await this.userRepository.count({
      type: UserType.Student,
      createdAt: {
        lte: oneMonthAgo,
      },
    });

    // Calculate the percentage increase in total students from last month in 2 decimal places
    const percentageIncreaseInTotalStudents = parseFloat(
      (((totalStudents - studentsLastMonth) / studentsLastMonth) * 100).toFixed(
        2,
      ),
    );

    return {
      totalUsers: {
        value: totalUsers,
        percentageIncreaseInTotalUsers,
        usersLastMonth,
      },
      totalEducators: {
        value: totalEducators,
        percentageIncreaseInTotalEducators,
      },
      totalStudents: {
        value: totalStudents,
        percentageIncreaseInTotalStudents,
      },
    };
  }

  async getUserInfo(id: string) {
    const user = await this.userRepository.uniqueUser({ id: Number(id) });

    //get all total number of certificates for the user
    const totalCertificates =
      await this.certificateRepository.countCertificates({
        userId: user.id,
      });

    const quizesByUser = await this.quizRepository.countQuizes({
      userId: user.id,
    });

    const passingGrade = 70;
    const passedQuizes = await this.quizRepository.countQuizes({
      userId: user.id,
      gradeInPercentage: {
        gte: passingGrade,
      },
    });

    const quizSuccessRate = (passedQuizes / quizesByUser) * 100;

    //get total courses taken
    const totalCoursesTakenByUser =
      await this.courseProgressRepository.countCourseProgress({
        userId: user.id,
      });

    const requiredProgressForCompletion = 90;

    const totalCourseCompletedbyUser =
      await this.courseProgressRepository.countCourseProgress({
        userId: user.id,
        progressPercentage: {
          gte: requiredProgressForCompletion,
        },
      });

    const percentageCompleted =
      (totalCourseCompletedbyUser / totalCoursesTakenByUser) * 100;
    return {
      user,
      totalCertificates,
      quizesByUser,
      quizSuccessRate,
      totalCoursesTakenByUser,
      totalCourseCompletedbyUser,
      percentageCompleted,
    };
  }

  async getUserCourses(id: string) {
    try {
      // get the user's courses enrolled using the course progress, also count the number of quizzes attempted

      const coursesEnrolled = await this.prisma.courseProgress.findMany({
        where: {
          userId: Number(id),
        },
        select: {
          createdAt: true, // Enrolled date
          completedDateTime: true, // Completion date
          course: {
            select: {
              title: true, // Course title
              Quiz: {
                where: {
                  userId: Number(id),
                },
                select: {
                  gradeInPercentage: true, // Grade in percentage
                },
              },
            },
          },
        },
      });

      const coursesWithQuizStats = coursesEnrolled.map((courseProgress) => {
        const quizzes = courseProgress.course.Quiz;
        const quizzesAttempted = quizzes.length;
        const highestGrade = quizzes.length
          ? Math.max(...quizzes.map((quiz) => quiz.gradeInPercentage))
          : null;

        return {
          courseTitle: courseProgress.course.title,
          enrolledDate: courseProgress.createdAt,
          completionDate: courseProgress.completedDateTime,
          quizzesAttempted,
          highestQuizGrade: highestGrade,
        };
      });

      return coursesWithQuizStats;
    } catch (error) {
      throw error;
    }
  }

  async getCoursesAnalytics() {
    //total courses
    const totalCourses = await this.courseRepository.countCourses();

    // get total active courses

    const totalActiveCourses = await this.courseRepository.countCourses({
      status: CourseStatus.ACTIVE,
    });

    // get archived courses

    const totalArchivedCourses = await this.courseRepository.countCourses({
      status: CourseStatus.ARCHIVED,
    });

    // get total certificates

    const totalCertificates =
      await this.certificateRepository.countCertificates();

    const totalQuizes = await this.quizRepository.countQuizes();
    const passingGrade = 70;
    const successfulQuizes = await this.quizRepository.countQuizes({
      gradeInPercentage: {
        gte: passingGrade,
      },
    });

    const quizSuccessRate = parseFloat(
      ((successfulQuizes / totalQuizes) * 100).toFixed(2),
    );

    const failedQuizes = totalQuizes - successfulQuizes;

    const failedQuizesRate = parseFloat(
      ((failedQuizes / totalQuizes) * 100).toFixed(2),
    );

    return {
      totalCourses,
      totalActiveCourses,
      totalArchivedCourses,
      totalCertificates,
      totalQuizes,
      quizSuccessRate,
      failedQuizesRate,
    };
  }

  async getCertificateDistribution(type: Period, value: any) {
    if (type === Period.YEARLY) {
      return this.getCertificateDistributionForYear(value);
    }
  }

  async getUsersForEachMonth() {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const usersPerMonth = await this.userRepository.userGroupBy(
      "createdAt",
      {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      {
        _all: true,
      },
      {
        createdAt: "asc",
      },
    );

    // Aggregate the result by month
    const monthlyUsers = Array(12).fill(0); // To represent each month (Jan - Dec)

    usersPerMonth.forEach((user) => {
      const month = new Date(user.createdAt).getMonth(); // Get month index (0 = Jan, 11 = Dec)
      monthlyUsers[month] += user._count._all;
    });

    // Return the result with proper month names
    return monthlyUsers.map((count, index) => ({
      month: monthNames[index], // Convert index to month name
      userCount: count,
    }));
  }

  async getCertificateDistributionForYear(year: number) {
    // const currentYear = new Date().getFullYear();

    // Get the total number of certificates for each month in the year

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const certificatesPerMonth =
      await this.certificateRepository.groupByCertificate(
        "createdAt",
        {
          createdAt: {
            gte: new Date(`${Number(year)}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
          },
        },
        {
          _all: true,
        },
        {
          createdAt: "asc",
        },
      );

    // Aggregate the result by month
    const monthlyCertificates = Array(12).fill(0); // To represent each month (Jan - Dec)

    certificatesPerMonth.forEach((certificate) => {
      const month = new Date(certificate.createdAt).getMonth(); // Get month index (0 = Jan, 11 = Dec)
      monthlyCertificates[month] += certificate._count._all;
    });

    // Return the result with proper month names

    return monthlyCertificates.map((count, index) => ({
      month: monthNames[index], // Convert index to month name
      certificateCount: count,
    }));
  }

  async getAllCourses() {
    // get all courses, also get the count of number of course progress that exceeds 90% which is the completion rate
    const courses = await this.courseRepository.courses(
      {},
      {
        _count: {
          select: {
            progress: {
              where: {
                progressPercentage: {
                  gte: 90,
                },
              },
            },
          },
        },
      },
    );

    return courses;
  }

  async getCourse(courseId: string) {
    try {
      const course = await this.courseRepository.findOne({
        id: Number(courseId),
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      return course;
    } catch (error) {
      throw error;
    }
  }

  // async getVideoDuration(filePath: string): Promise<number> {
  //   return new Promise((resolve, reject) => {
  //     ffmpeg.ffprobe(filePath, (err, metadata) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       const duration = metadata.format.duration;
  //       resolve(duration); // duration in seconds
  //     });
  //   });
  // }
  private async getVideoDuration(buffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
      // Create a temporary file
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) {
          return reject(err);
        }

        // Write the buffer to the temporary file
        fs.writeFile(path, buffer, (writeErr) => {
          if (writeErr) {
            cleanupCallback();
            return reject(writeErr);
          }

          // Use ffprobe on the temporary file
          ffmpeg.ffprobe(path, (probeErr, metadata) => {
            cleanupCallback(); // Always cleanup the temporary file

            if (probeErr) {
              return reject(probeErr);
            }

            resolve(metadata.format.duration);
          });
        });
      });
    });
  }
  async createCourse(
    createCourseDto: CreateCourseDto,
    files: {
      course_video?: Express.Multer.File[];
      thumbnail_image?: Express.Multer.File[];
    },
  ) {
    try {
      const { title, description } = createCourseDto;

      if (!files?.thumbnail_image) {
        throw new HttpException(
          "Thumbnail image is required, key should be thumbnail_image",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!files?.course_video) {
        throw new HttpException(
          "Course video is required, key should be course_video",
          HttpStatus.BAD_REQUEST,
        );
      }
      const duration = await this.getVideoDuration(
        files.course_video[0].buffer,
      );

      const uploadedThumbnail = await this.uploadService.s3UploadFile(
        files.thumbnail_image[0],
        "thumbnails",
      );

      const uploadedCourseVideo = await this.uploadService.s3UploadFile(
        files.course_video[0],
        "videos",
      );

      //create course
      const newCourse = await this.courseRepository.create({
        title,
        description,
        thumbnail_image: uploadedThumbnail.fileUrl,
        video_url: uploadedCourseVideo.fileUrl,
        duration,
      });
      return successResponse(newCourse, "Course created successfully");
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(
    updateCourseDto: UpdateCourseDto,
    thumbnail_image: Express.Multer.File,
    courseId: string,
  ) {
    try {
      const { title, description } = updateCourseDto;

      //check if course exists
      const course = await this.courseRepository.findOne({
        id: Number(courseId),
      });

      if (!course) {
        throw new HttpException("Course not found", HttpStatus.NOT_FOUND);
      }

      //check if thumbnail image exists
      if (thumbnail_image) {
        //upload thumbnail image
        const uploadedThumbnail = await this.uploadService.s3UploadFile(
          thumbnail_image,
          "thumbnails",
        );

        updateCourseDto.thumbnail_image = uploadedThumbnail.fileUrl;
      }

      //update course
      const updatedCourse = await this.courseRepository.update({
        where: { id: Number(courseId) },
        data: updateCourseDto,
      });

      return successResponse(updatedCourse, "Course updated successfully");
    } catch (error) {
      throw error;
    }
  }

  async getAdmins() {
    try {
      const admins = await this.adminRepository.findAll();
      return admins;
    } catch (error) {
      throw error;
    }
  }

  async getAdmin(id: string) {
    try {
      const admin = await this.adminRepository.findOne({ id: Number(id) });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async inviteAdmin(inviteAdmin: InviteAdminDto) {
    //generate password
    const password = generatePassword(10);

    //check if admin already exists
    const admin = await this.adminRepository.findOneByEmail(inviteAdmin.email);
    if (admin) {
      throw new HttpException(
        "Admin with that email already exists",
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //create admin
    const newAdmin = await this.adminRepository.create({
      email: inviteAdmin.email,
      name: inviteAdmin.name,
      password: hashedPassword,
    });

    //send email to admin
    await this.mailService.sendMailNodeMailer({
      to: newAdmin.email,
      subject: "Admin Invitation",
      text: `Hello ${newAdmin.name}, you have been invited to be an admin on our platform. Your password is ${password}`,
      html: `<p>Hello ${newAdmin.name}, you have been invited to be an admin on our platform. Your password is ${password}</p>`,
    });

    return successResponse(null, "Admin invited successfully");
  }
  async changePassword(
    adminChangePasswordDto: AdminChangePasswordDto,
    adminUserId: number,
  ) {
    try {
      const { oldPassword, newPassword, confirmPassword } =
        adminChangePasswordDto;

      //check if password and confirm password match
      if (newPassword !== confirmPassword) {
        throw new HttpException(
          "Password and confirm password do not match",
          HttpStatus.BAD_REQUEST,
        );
      }

      const adminUser = await this.adminRepository.findOne({
        id: adminUserId,
      });

      //check if old password matches
      const isMatch = await bcrypt.compare(oldPassword, adminUser.password);

      if (!isMatch) {
        throw new HttpException("Invalid old password", HttpStatus.BAD_REQUEST);
      }

      //hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //update user password
      await this.adminRepository.update({
        where: { email: adminUser.email },
        data: { password: hashedPassword },
      });

      return successResponse({}, "Password changed successfully");
    } catch (error) {
      throw error;
    }
  }
}
