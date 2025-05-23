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
  Query,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
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
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";
import { UpdateAdminUserDto } from "./dto/update-admin.dto";
import { CreateCourseQuestionsDto } from "./dto/create-course-questions.dto";
import { CourseStatus, CourseType, Type, UserStatus } from "@prisma/client";
import { SendMessageToAllUsersDto } from "./dto/send-message-to-all-users.dto";
import { SendMessageToUserDto } from "./dto/send-message-to-user.dto";
// import { CreateAdminDto } from "./dto/create-admin.dto";
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

  // //create admin user
  // @ApiOperation({
  //   summary: "Create Admin User",
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: "Admin user created successfully",
  // })
  // @ApiBody({
  //   type: CreateAdminDto,
  // })
  // @ApiBearerAuth()
  // @Post("create-admin")
  // @Public()
  // async createAdmin(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

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

  // Get logged in admin user
  @ApiOperation({ summary: "Get Logged in Admin User" })
  @Get("me")
  @ApiBearerAuth()
  async getMe(@Request() req) {
    return this.adminService.getMe(req.user.id);
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
  @ApiQuery({
    name: "page",
    required: true,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "pageSize",
    required: true,
    type: Number,
    description: "Number of items per page",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search term",
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    description: "Filter by Status",
  })
  @ApiQuery({
    name: "userType",
    required: false,
    type: String,
    description: "Filter by User Type",
  })
  @ApiBearerAuth()
  async getAllUsers(
    @Query("page") page: number = 1,
    @Query("pageSize") pageSize: number = 10,
    @Query("search") search: string,
    @Query("status") status: UserStatus,
    @Query("userType") userType: Type,
  ) {
    return this.adminService.getAllUsers(
      page,
      pageSize,
      search,
      status,
      userType,
    );
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

  // Update admin user
  @Patch("")
  @UseInterceptors(FileInterceptor("profile_photo", multerOptions))
  @ApiOperation({
    summary: "Update user",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: UpdateAdminUserDto,
    description: "Json structure for user object",
  })
  @ApiBearerAuth()
  update(
    @Body() updateAdminUserDto: UpdateAdminUserDto,
    @Request() req,
    @UploadedFile()
    profile_photo: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.adminService.update(userId, updateAdminUserDto, profile_photo);
  }
  //get Admin Users
  @ApiOperation({ summary: "Get Admin Users" })
  @Get("admins")
  @ApiBearerAuth()
  async getAdmin(
    @Query("page") page: number = 1,
    @Query("pageSize") pageSize: number = 10,
  ) {
    return this.adminService.getAdmins(page, pageSize);
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

  // send message to all users
  @ApiOperation({ summary: "Send Message to All Users" })
  @Post("send-message")
  @ApiBearerAuth()
  async sendMessage(
    @Body() sendMessageToAllUsersDto: SendMessageToAllUsersDto,
  ) {
    return this.adminService.sendMessageToAllUsers(sendMessageToAllUsersDto);
  }

  // send message to a single user
  @ApiOperation({ summary: "Send Message to a User" })
  @Post("send-message/:userId")
  @ApiBearerAuth()
  async sendMessageToUser(
    @Body() sendMessageToUserDto: SendMessageToUserDto,
    @Param("userId") userId: string,
  ) {
    return this.adminService.sendMessageToUser(sendMessageToUserDto, userId);
  }

  // // change password
  @Patch("change-password")
  @ApiOperation({
    summary: "Change Password",
  })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: AdminChangePasswordDto,
    description: "Json structure for change password object",
  })
  @ApiBearerAuth()
  changePassword(
    @Body() adminChangePasswordDto: AdminChangePasswordDto,
    @Request() req,
  ) {
    return this.adminService.changePassword(
      adminChangePasswordDto,
      req.user.id,
    );
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
  //Get all users
  @ApiOperation({ summary: "Get All Users" })
  @Get("users")
  @ApiQuery({
    name: "page",
    required: true,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "pageSize",
    required: true,
    type: Number,
    description: "Number of items per page",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search term",
  })
  async getAllCourses(
    @Query("page") page: number = 1,
    @Query("pageSize") pageSize: number = 10,
    @Query("search") search: string,
    @Query("status") status: CourseStatus,
    @Query("type") type: CourseType,
  ) {
    return this.adminService.getAllCourses(
      page,
      pageSize,
      search,
      status,
      type,
    );
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

  // Update Question
  @Patch("update-question/:questionId")
  @ApiOperation({
    summary: "Update Question",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CreateCourseQuestionDto,
    description: "Json structure for user object",
  })
  @ApiBearerAuth()
  updateQuestion(
    @Body() createCourseQuestionDto: CreateCourseQuestionDto,
    @Request() req,
    @Param("questionId") questionId: string,
  ) {
    return this.adminService.updateQuestion(
      createCourseQuestionDto,
      questionId,
    );
  }

  // create questions
  @ApiOperation({ summary: "Create Questions" })
  @ApiBearerAuth()
  @Post("create-questions")
  async createQuestions(
    @Body() createCourseQuestionsDto: CreateCourseQuestionsDto,
  ) {
    return this.adminService.createQuestions(createCourseQuestionsDto);
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
    @Request() req,
    @UploadedFiles()
    files: {
      course_video?: Express.Multer.File[];
      thumbnail_image?: Express.Multer.File[];
    },
  ) {
    return this.adminService.createCourse(createCourseDto, files, req.user.id);
  }

  @Patch(":courseId")
  @UseInterceptors(FileInterceptor("thumbnail_image", multerOptions))
  @ApiOperation({
    summary: "Update Course",
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
  @ApiBearerAuth()
  update(
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req,
    @Param("courseId") courseId: string,
    @UploadedFile()
    thumbnail_image: Express.Multer.File,
  ) {
    // return {
    //   updateCourseDto,
    //   thumbnail_image,
    //   courseId,
    // };
    return this.adminService.updateCourse(
      updateCourseDto,
      thumbnail_image,
      courseId,
    );
  }

  //delete course
  @ApiOperation({
    summary: "Delete Course",
  })
  @ApiResponse({
    status: 200,
    description: "Course deleted successfully",
  })
  @ApiBearerAuth()
  @Patch("delete/:courseId")
  async deleteCourse(@Param("courseId") courseId: string) {
    return this.adminService.deleteCourse(courseId);
  }
}
