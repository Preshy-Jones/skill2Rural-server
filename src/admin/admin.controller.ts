import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Request,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Patch,
  UploadedFile,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";

import { Period } from "src/common/global/interface";
import { Public } from "src/common/decorators/jwt-auth-guard.decorator";
import { CreateCourseDto } from "./dto/create-course.dto";
import { AdminLoginGuard } from "src/common/guards/admin-login-guard";
import multer from "multer";
import { InviteAdminDto } from "./dto/invite-admin.dto";
import { CreateCourseQuestionDto } from "./dto/create-course-question.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
const storage = multer.memoryStorage();

export const multerOptions = {
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail_image") {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg(\+xml)?)$/)) {
        return cb(
          new HttpException(
            "Only image files are allowed for thumbnail!",
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    } else if (file.fieldname === "course_video") {
      if (!file.mimetype.match(/^video\//)) {
        return cb(
          new HttpException(
            "Only video files are allowed for course video!",
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    }
    cb(null, true);
  },
};

@ApiTags("Admin user")
@UseGuards(AdminAuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //login
  @ApiOperation({ summary: "Login" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiBody({
    type: LoginAdminDto,
  })
  @Public()
  @UseGuards(AdminLoginGuard)
  @Post("login")
  async login(@Request() req) {
    return this.adminService.login(req.user);
  }

  //dashboard analytics

  @ApiOperation({ summary: "Dashboard Analytics" })
  @Get("dashboard-analytics")
  @ApiBearerAuth()
  async dashboard() {
    return this.adminService.dashboardAnalytics();
  }

  //Get all users
  @ApiOperation({ summary: "Get All Users" })
  @Get("users")
  @ApiBearerAuth()
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // Get users stats
  @ApiOperation({ summary: "Get Users Stats" })
  @Get("users-stats")
  @ApiBearerAuth()
  async getUsersStats() {
    return this.adminService.getUsersStats();
  }

  //get User Information by id
  @ApiOperation({ summary: "Get User Information" })
  @Get("user/:id")
  @ApiBearerAuth()
  async getUserInfo(@Param("id") id: string) {
    return this.adminService.getUserInfo(id);
  }

  // get user courses
  @ApiOperation({ summary: "Get User's courses" })
  @Get("user/:id/courses")
  @ApiBearerAuth()
  async getUserCourses(@Param("id") id: string) {
    return this.adminService.getUserCourses(id);
  }

  // Update user

  //get Admin Users
  @ApiOperation({ summary: "Get Admin Users" })
  @Get("admins")
  @ApiBearerAuth()
  async getAdmin() {
    return this.adminService.getAdmins();
  }

  // Get an admin user
  @ApiOperation({ summary: "Get Admin User" })
  @Get("admin/:id")
  @ApiBearerAuth()
  async getAdminUser(@Param("id") id: string) {
    return this.adminService.getAdmin(id);
  }

  //Invite new admin User
  @ApiOperation({ summary: "Invite New Admin User" })
  @Post("invite-admin")
  @ApiBearerAuth()
  async inviteAdmin(@Body() inviteAdminDto: InviteAdminDto) {
    return this.adminService.inviteAdmin(inviteAdminDto);
  }
}

@ApiTags("Admin Course")
@UseGuards(AdminAuthGuard)
@Controller("admin/course")
export class AdminCourseController {
  constructor(private readonly adminService: AdminService) {}
  //dashboard analytics
  @ApiOperation({ summary: "Dashboard Analytics" })
  @Get("dashboard-analytics")
  @ApiBearerAuth()
  async dashboard() {
    return this.adminService.getCoursesAnalytics();
  }

  // get certificate distribution
  @ApiOperation({ summary: "Get Certificate Distribution" })
  @Get("certificate-distribution/:type/:value")
  @ApiBearerAuth()
  async certificateDistribution(
    @Param("type") type: Period,
    @Param("value") value: string,
  ) {
    return this.adminService.getCertificateDistribution(type, value);
  }

  // Get all courses
  @ApiOperation({ summary: "Get All Courses" })
  @Get()
  @ApiBearerAuth()
  async getAllCourses() {
    return this.adminService.getAllCourses();
  }

  // Get course
  @ApiOperation({ summary: "Get Course" })
  @Get(":courseId")
  @ApiBearerAuth()
  async getCourse(@Param("courseId") courseId: string) {
    return this.adminService.getCourse(courseId);
  }

  //create Question
  @ApiOperation({ summary: "Create Question" })
  @ApiBearerAuth()
  @Post("create-question")
  async createQuestion(
    @Body() createCourseQuestionDto: CreateCourseQuestionDto,
  ) {
    return this.adminService.createQuestion(createCourseQuestionDto);
  }

  // Get a course's questions
  @ApiOperation({ summary: "Get Course Questions" })
  @Get(":courseId/questions")
  @ApiBearerAuth()
  async getCourseQuestions(@Param("courseId") courseId: string) {
    return this.adminService.getCourseQuestions(courseId);
  }

  //create Course
  @ApiOperation({
    summary: "Create Course",
  })
  @ApiResponse({
    status: 201,
    description: "Course created successfully",
  })
  @ApiBody({
    type: CreateCourseDto,
  })
  @ApiBearerAuth()
  @Post("create-course")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "course_video", maxCount: 1 },
        { name: "thumbnail_image", maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,

    @UploadedFiles()
    files: {
      course_video?: Express.Multer.File[];
      thumbnail_image?: Express.Multer.File[];
    },
  ) {
    return this.adminService.createCourse(createCourseDto, files);
  }

  @Patch("")
  @UseInterceptors(FileInterceptor("thumbnail_image", multerOptions))
  @ApiOperation({
    summary: "Update user",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: UpdateCourseDto,
    description: "Json structure for user object",
  })
  update(
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req,
    @Param("courseId") courseId: string,
    @UploadedFile()
    thumbnail_image: Express.Multer.File,
  ) {
    return this.adminService.updateCourse(
      updateCourseDto,
      thumbnail_image,
      courseId,
    );
  }
}
