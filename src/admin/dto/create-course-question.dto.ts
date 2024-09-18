import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCourseQuestionDto {
  @ApiProperty({
    description: "The title of the course question",
    example: "What is TypeScript?",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The description of the course question",
    example: "Explain the basics of TypeScript.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The ID of the course this question belongs to",
    example: "12345",
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
