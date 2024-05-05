import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class AddQuestionDto {
  @ApiProperty({
    description: "The question",
    type: String,
    example: "What is the capital of Nigeria",
  })
  @IsNotEmpty()
  question: string;

  // @ApiProperty({
  //   description: "The options for the question",
  //   type: [String],
  //   example: ["Abuja", "Lagos", "Kano", "Ibadan"],
  // })
  // @IsNotEmpty()
  // options: string[];

  @ApiProperty({
    description: "The correct answer to the question",
    type: String,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  // @IsEnum(QuestionAnswer)
  answer: number;

  @ApiProperty({
    description: "The point for the question",
    type: Number,
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @ApiProperty({
    description: "The options for the question",
    type: [String],
    example: ["Abuja", "Lagos", "Kano", "Ibadan"],
  })
  @IsNotEmpty()
  options: string[];
}
