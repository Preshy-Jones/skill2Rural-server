import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  loginUser(loginUserDto: LoginUserDto) {
    return {
      message: 'Login successful',
      data: {
        loginUserDto,
        token: this.jwtService.sign(loginUserDto),
      },
    };
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException(
          'No user with that email exists in our records',
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
      }

      return {
        email: user.email,
        id: user.id,
        name: user.name,
      };
    } catch (error) {
      throw error;
    }
  }
}
