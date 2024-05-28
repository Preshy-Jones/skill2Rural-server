import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Request,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateEducatorDto } from "./dto/create-educator.dto";
import { Public } from "src/common/decorators/jwt-auth-guard.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { successResponse } from "src/common/utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config/multer.config";
import { ChangePasswordDto } from "./dto/changePassword.dto";

// import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: "Register new user",
  })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CreateUserDto,
    description: "Json structure for user object",
  })
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: "Register new educator",
  })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @Public()
  @Post("educator")
  createEducator(@Body() createEducatorDto: CreateEducatorDto) {
    return this.userService.create(createEducatorDto);
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
    type: ChangePasswordDto,
    description: "Json structure for change password object",
  })
  @ApiBearerAuth()
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.userService.changePassword(changePasswordDto, req.user.id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @ApiOperation({
    summary: "Update user",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: UpdateUserDto,
    description: "Json structure for user object",
  })
  update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file);

    // return {
    //   updateUserDto,
    //   file: file,
    // };
    return this.userService.update(id, updateUserDto, file);
  }

  // get logged in user
  @Get("me")
  @ApiOperation({
    summary: "Get logged in user",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBearerAuth()
  getLoggedInUser(@Request() req) {
    return successResponse(req.user, "User retrieved successfully");
  }

  @Post("forgot-password")
  @ApiOperation({
    summary: "Forgot Password",
  })
  @ApiResponse({
    status: 200,
    description:
      "An email has been sent to your email address with instructions on how to reset your password",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Public()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Patch("reset-password/:token")
  @ApiOperation({
    summary: "Reset Password",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset successful",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Public()
  async resetPassword(
    @Param("token") token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(token, resetPasswordDto);
  }

  //get all users
  @Get("/all")
  @ApiOperation({
    summary: "Get all users",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAllUsers();
  }
}
