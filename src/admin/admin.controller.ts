import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
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
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config/multer.config";
import { Period } from "src/common/global/interface";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // sign up
  @ApiOperation({ summary: "Sign Up" })
  @ApiResponse({
    status: 201,
    description: "Admin created successfully",
  })
  @ApiBody({
    type: CreateAdminDto,
  })
  @Post("register")
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  //login
  @ApiOperation({ summary: "Login" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiBody({
    type: LoginAdminDto,
  })
  @UseGuards(AdminAuthGuard)
  @Post("login")
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  //Invite new admin User

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
}

@ApiTags("Admin Course")
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

  //create Question
  @ApiOperation({ summary: "Create Question" })
  @Post("create-question")
  async createQuestion() {
    return this.adminService.createQuestion();
  }

  // create course
  @ApiOperation({ summary: "Create Course" })
  @Post()
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async createCourse(
    @Body() body: any,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.adminService.createCourse();
  }
}
