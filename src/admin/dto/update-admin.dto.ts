import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAdminUserDto {
  @ApiProperty({
    description: "The name of the user",
    type: String,
    example: "Precious Adedibu",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The profile photo of the user",
    type: String,
    example:
      "https://res.cloudinary.com/adedibu/image/upload/v1632188898/adedibu.jpg",
  })
  profile_photo: string;
}
