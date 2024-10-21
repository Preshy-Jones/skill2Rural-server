import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ArrayNotEmpty,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class QuestionDto {
  @ApiProperty({
    description: "The question",
    example: "What is TypeScript?",
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: "The answer (index of the correct option)",
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(4)
  @Min(0)
  answer: number;

  @ApiProperty({
    description: "The point",
    example: 10,
  })
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
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  options: string[];
}

export class CreateCourseQuestionsDto {
  @ApiProperty({
    description: "The course id",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description: "Array of questions",
    type: [QuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ArrayNotEmpty()
  questions: QuestionDto[];
}
