import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
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
import { Public } from "src/common/decorators/jwt-auth-guard.decorator";

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

  //create Course
  @ApiOperation({ summary: "Create Course" })
  @Post("create-course")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async createCourse() {
    return this.adminService.createCourse();
  }

  //create Question
  @ApiOperation({ summary: "Create Question" })
  @Post("create-question")
  async createQuestion() {
    return this.adminService.createQuestion();
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
}
