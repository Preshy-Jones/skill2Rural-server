import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "The name of the user",
    type: String,
    example: "Precious Adedibu",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The email of the user",
    type: String,
    example: "adedibuprecious@gmail.com",
  })
  email: string;

  @ApiProperty({
    description: "The organisation of the user",
    type: String,
    example: "HNGi8",
  })
  @IsOptional()
  @IsString()
  organisation: string;

  @ApiProperty({
    description: "The profile photo of the user",
    type: String,
    example:
      "https://res.cloudinary.com/adedibu/image/upload/v1632188898/adedibu.jpg",
  })
  profile_photo: string;
}
