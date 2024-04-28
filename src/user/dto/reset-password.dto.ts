import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    description: "New password",
    type: String,
    example: "newPassword",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: "Password too weak",
  })
  newPassword: string;

  @ApiProperty({
    description: "Confirm password",
    type: String,
    example: "confirmPassword",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  confirmPassword: string;

  // @ApiProperty({
  //   description: "The code sent to the user's email",
  //   type: String,
  //   example: "123456",
  // })
  // @IsString()
  // @IsNotEmpty()
  // code: string;
}
