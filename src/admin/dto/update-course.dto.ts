import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class UpdateCourseDto {
  @ApiProperty({ description: "The title of the course" })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: "The description of the course",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The thumbnail image of the course",
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail_image: string;
}
