import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcryptjs";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "src/admin/admin.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}
  loginUser(loginUserDto: LoginUserDto) {
    console.log("dhdhdhh");

    return {
      message: "Login successful",
      data: {
        user: loginUserDto,
        accessToken: this.jwtService.sign(loginUserDto, {
          expiresIn: "1d",
        }),
      },
    };
  }
  async validateStudent(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email, "STUDENT");
      if (!user) {
        throw new HttpException(
          "No user with that email exists in our records",
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException("Invalid Password", HttpStatus.UNAUTHORIZED);
      }

      return {
        email: user.email,
        id: user.id,
        name: user.name,
        profile_photo: user.profile_photo,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateEducator(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email, "EDUCATOR");
      if (!user) {
        throw new HttpException(
          "No user with that email exists in our records",
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException("Invalid Password", HttpStatus.UNAUTHORIZED);
      }

      return {
        email: user.email,
        id: user.id,
        name: user.name,
        profile_photo: user.profile_photo,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateAdmin(email: string, password: string) {
    try {
      const admin = await this.adminService.findByEmail(email);
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
