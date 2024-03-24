import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
// @ApiHeader({
//   name: 'Authorization',
//   description: 'Bearer token',
// })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Login User')
  @UseGuards(LocalAuthGuard)
  @Post('login/user')
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiBody({
    type: LoginUserDto,
  })
  async loginUser(@Request() req) {
    return this.authService.loginUser(req.user);
  }
}
