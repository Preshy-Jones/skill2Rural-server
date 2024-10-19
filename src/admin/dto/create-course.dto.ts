import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ description: "The title of the course" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The description of the course",
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
