import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum UserType {
  Educator = "EDUCATOR",
  Student = "STUDENT",
}

export class CreateUserDto {
  @ApiProperty({
    description: "The name of the user",
    type: String,
    example: "Precious",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The email of the user",
    type: String,
    example: "adedibuprecious@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    type: String,
    example: "password",
  })
  //minimum length of password is 8, must contain a number, lowercase and uppercase letter and a special character
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @IsStrongPassword(
    {},
    {
      message:
        "Password too weak, it must contain a number, lowercase and uppercase letter and a special character",
    },
  )
  password: string;

  @ApiProperty({
    description: "The type of the user",
    type: String,
    example: UserType.Educator,
  })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;
}
