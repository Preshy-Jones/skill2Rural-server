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

export class UpdateCourseQuestionDto {
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
  @IsOptional()
  answer: number;

  @ApiProperty({
    description: "The point",
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
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
  @IsOptional()
  options: string[];
}
