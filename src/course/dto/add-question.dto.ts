import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

enum QuestionAnswer {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

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
    example: "TRUE",
  })
  @IsNotEmpty()
  @IsEnum(QuestionAnswer)
  answer: QuestionAnswer;
}
