import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCourseProgressDto {
  @ApiProperty({
    description: "The current time of the course",
    type: Number,
    example: 10,
  })
  @IsNumber()
  current_time: number;
}
