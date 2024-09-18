import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginAdminDto {
  @ApiProperty({
    description: "The email of the user",
    type: String,
    example: "adedibuprecious@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    type: String,
    example: "password",
  })
  @IsNotEmpty()
  @MinLength(5)
  @IsStrongPassword()
  password: string;
}
