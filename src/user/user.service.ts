import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "src/prisma.service";
import { UserRepository } from "./repositories/user.repository";
import * as bcrypt from "bcryptjs";
import { UpdateUserDto } from "./dto/update-user.dto";
import { decodeToken, successResponse } from "src/common/utils";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailService } from "src/mail/mail.service";
import { AccountRecoveryRepository } from "./repositories/accountRecovery.repository";
import { forgotPasswordTemplate } from "src/common/utils/mailTemplates";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtService } from "@nestjs/jwt";
// import { AccountRecoveryRepository } from './repositories/accountRecovery.repository';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    private AccountRecoveryRepository: AccountRecoveryRepository,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const user = await this.userRepository.findOneByEmail(email);

      console.log(user, "user");

      //check if user already exists
      if (user) {
        throw new HttpException(
          "User with that email already exists",
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      createUserDto.password = hashedPassword;

      const savedUser = await this.userRepository.create(createUserDto);

      return successResponse(savedUser, "User created successfully");
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  //update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findAllUsers() {
    try {
      return this.userRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      // const code = generateOtp();

      //check if user exists
      const user = await this.findByEmail(forgotPasswordDto.email);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      const jwtPayload = {
        email: forgotPasswordDto.email,
      };

      //generate jwt token
      const token = await this.jwtService.sign(jwtPayload, {
        expiresIn: "3h",
      });

      const frontendUrl = process.env.FRONTEND_URL;
      const magicLink = `${frontendUrl}/reset-password/${token}`;

      //send otp to user email
      const mailData = {
        to: forgotPasswordDto.email,
        subject: "Forgot Password",
        text: `Click on the link below to reset your password ${magicLink}`,
        // eslint-disable-next-line prettier/prettier
        html: forgotPasswordTemplate(magicLink, user.name),
      };

      this.mailService.sendMailNodeMailer(mailData);

      //save token to database
      await this.AccountRecoveryRepository.create({
        email: forgotPasswordDto.email,
        token,
        userId: user.id,
      });

      return successResponse(
        {},
        "An email has been sent to your email address with instructions on how to reset your password",
      );
    } catch (error) {
      throw error;
    }
  }

  // async resetPassword(resetPasswordDto: ResetPasswordDto) {
  //   const { code, newPassword, confirmPassword } = resetPasswordDto;

  //   //check if recovery code exists
  //   const recoveryCode = await this.AccountRecoveryRepository.findFirst({
  //     token: code,
  //   });

  //   if (!recoveryCode) {
  //     throw new HttpException("Invalid recovery code", HttpStatus.BAD_REQUEST);
  //   }

  //   //check if code has expired
  //   if (new Date() > recoveryCode.expiresAt) {
  //     throw new HttpException(
  //       "Recovery code has expired",
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   //check if password and confirm password match
  //   if (newPassword !== confirmPassword) {
  //     throw new HttpException(
  //       "Password and confirm password do not match",
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   //hash password
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);

  //   //update user password
  //   await this.userRepository.update({
  //     where: { email: recoveryCode.email },
  //     data: { password: hashedPassword },
  //   });

  //   //delete recovery code
  //   await this.AccountRecoveryRepository.delete({ id: recoveryCode.id });

  //   return successResponse({}, "Password reset successful");
  // }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    try {
      const { newPassword, confirmPassword } = resetPasswordDto;
      //verify token

      let decoded: any;
      try {
        decoded = await decodeToken(token, this.jwtService);
      } catch (error) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

      //check if token exists in database
      const accountRecovery = await this.AccountRecoveryRepository.findFirst({
        token,
      });

      if (!accountRecovery) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

      //get user email from token
      const email = decoded.email;

      //check if user exists
      const user = await this.findByEmail(email);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      //check if password and confirm password match
      if (newPassword !== confirmPassword) {
        throw new HttpException(
          "Password and confirm password do not match",
          HttpStatus.BAD_REQUEST,
        );
      }

      //hash password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //update user password
      await this.userRepository.update({
        where: { email },
        data: { password: hashedPassword },
      });

      // delete recovery code
      await this.AccountRecoveryRepository.delete({ id: accountRecovery.id });

      return successResponse({}, "Password reset successful");
    } catch (error) {
      throw error;
    }
  }
}
