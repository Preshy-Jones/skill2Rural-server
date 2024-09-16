import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({
    description: "The name of the admin",
    type: String,
    example: "Precious",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The email of the admin",
    type: String,
    example: "adedibuprecious@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The password of the admin",
    type: String,
    example: "password",
  })
  //minimum length of password is 8, must contain a number, lowercase and uppercase letter and a special character
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      "Password too weak, it must contain a number, lowercase and uppercase letter and a special character",
  })
  password: string;
}
