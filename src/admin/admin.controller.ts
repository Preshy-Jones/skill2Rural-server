import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guard";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // sign up
  @ApiTags("Sign Up")
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
  @ApiTags("Login")
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
  @ApiTags("Create Course")
  @Post("create-course")
  async createCourse() {
    return this.adminService.createCourse();
  }

  //create Question
  @ApiTags("Create Question")
  @Post("create-question")
  async createQuestion() {
    return this.adminService.createQuestion();
  }
}
