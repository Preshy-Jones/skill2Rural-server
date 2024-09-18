import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from "class-validator";

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
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "The duration of the course in hours" })
  @IsNumber()
  @Min(1)
  @Max(100)
  duration: number;

  @ApiProperty({ description: "The instructor of the course" })
  @IsString()
  @IsNotEmpty()
  instructor: string;
}
