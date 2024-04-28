import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "The email of the user",
    type: String,
    example: "adedibuprecious@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
