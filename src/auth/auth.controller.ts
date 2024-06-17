import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";
import { Public } from "src/common/decorators/jwt-auth-guard.decorator";
import { EducatorAuthGuard } from "src/common/guards/educator-auth.guard";
import { StudentAuthGuard } from "src/common/guards/student-auth.guard";
// import { LoginUserDto } from './dto/login-user.dto';

@Controller("auth")
// @ApiHeader({
//   name: 'Authorization',
//   description: 'Bearer token',
// })
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags("Login User")
  @UseGuards(StudentAuthGuard)
  @Post("login/student")
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiBody({
    type: LoginUserDto,
  })
  async loginUser(@Request() req) {
    return this.authService.loginUser(req.user);
  }

  @ApiTags("Login Educator")
  @UseGuards(EducatorAuthGuard)
  @Post("login/educator")
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiBody({
    type: LoginUserDto,
  })
  async loginEducator(@Request() req) {
    return this.authService.loginUser(req.user);
  }
}
