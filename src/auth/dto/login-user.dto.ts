import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'adedibuprecious@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  @MinLength(5)
  @IsStrongPassword()
  //   {
  //   minLength: 5,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // }
  password: string;

  user: any;
}
