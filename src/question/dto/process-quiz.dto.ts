import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ProcessQuizDto {
  @ApiProperty({
    description: "The grade of the certificate",
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  gradeInPercentage: number;
}
