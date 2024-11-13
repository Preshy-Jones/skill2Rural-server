import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ArrayNotEmpty,
  ArrayMaxSize,
  IsOptional,
} from "class-validator";

export class CreateCourseQuestionDto {
  @ApiProperty({
    description: "The question",
    example: "What is TypeScript?",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  question: string;
  

  @ApiProperty({
    description: "The answer (index of the correct option)", 
    example: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Max(4)
  @Min(0)
  answer: number;

  @ApiProperty({
    description: "The point",
    example: 10,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @ApiProperty({
    description: "The options",
    example: [
      "A superset of JavaScript",
      "A programming language",
      "A framework",
      "A library",
    ],
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  options: string[];

  @ApiProperty({
    description: "The course id",
    example: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
