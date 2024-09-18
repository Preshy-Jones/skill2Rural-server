import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminRepository } from "./repositories/admin.repository";
import { CertificateRepository } from "src/course/repositories/certificate.repository";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "src/user/repositories/user.repository";
import { CourseRepository } from "src/course/repositories/course.repository";
import { CourseProgress } from "@prisma/client";
import { CourseProgressRepository } from "src/course-progress/repositories/course-progress.repository";

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private certificateRepository: CertificateRepository,
    private userRepository: UserRepository,
    private courseRepository: CourseRepository,
    private courseProgress: CourseProgressRepository,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    return "This action adds a new admin";
  }

  async login(LoginAdminDto: LoginAdminDto) {}

  async createCourse() {
    return "This action adds a new course";
  }

  async createQuestion() {
    return "This action adds a new question";
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
    const usersPerMonth = await this.userRepository.getUsersForEachMonth();

    // get course completions for each course
    const courseCompletionsPerCourse =
      await this.courseProgress.getCourseCompletionsPerCourse();

    // get course completions per user type
    const courseCompletionsPerUserType =
      await this.courseProgress.getCourseCompletionsPerUserType();

    return {
      totalUsers,
      totalCourses,
      totalCertificates,
      usersPerMonth,
      courseCompletionsPerCourse,
      courseCompletionsPerUserType,
    };
  }

  async validateAdmin(email: string, password: string) {
    try {
      const admin = await this.findByEmail(email);
      if (!admin) {
        throw new HttpException(
          "No admin with that email exists in our records",
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new HttpException("Invalid Password", HttpStatus.UNAUTHORIZED);
      }

      return {
        email: admin.email,
        id: admin.id,
        name: admin.name,
        profile_photo: admin.profile_photo,
      };
    } catch (error) {
      throw error;
    }
  }
}
