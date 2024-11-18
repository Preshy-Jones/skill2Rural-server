import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InviteAdminDto {
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
}
