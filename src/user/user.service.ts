import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const user = await this.userRepository.findOneByEmail(email);

      console.log(user, 'user');

      //check if user already exists
      if (user) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      createUserDto.password = hashedPassword;

      const savedUser = await this.userRepository.create(createUserDto);

      return {
        message: 'User created successfully',
        data: savedUser,
      };
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
    return this.userRepository.update({
      where: { id },
      data: updateUserDto,
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
