import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class SubmitQuizDto {
  @ApiProperty({
    description: "The course ID",
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({
    description: "The user ID",
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: "The quiz ID",
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quizId: number;

  @ApiProperty({
    description: "The answers to the quiz questions",
    type: [Object],
    example: [
      {
        questionId: 1,
        answer: "TRUE",
      },
      {
        questionId: 2,
        answer: "FALSE",
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  answers: { questionId: number; answer: string }[];
}
