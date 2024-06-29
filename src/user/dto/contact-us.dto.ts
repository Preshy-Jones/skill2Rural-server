import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContactUsDto {
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
    example: "",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The subject of the user",
    type: String,
    example: "",
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: "The message of the user",
    type: String,
    example: "",
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
