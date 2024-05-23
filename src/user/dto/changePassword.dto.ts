import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Old password",
    type: String,
    example: "oldPassword",
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: "New password",
    type: String,
    example: "newPassword",
  })
  @IsString()
  @IsNotEmpty()
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
  @IsString()
  @IsNotEmpty()
  // @MinLength(8)
  // @MaxLength(30)
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
  //   message: "Password too weak",
  // })
  confirmPassword: string;
}
