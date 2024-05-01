import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddCourseReviewDto {
  @ApiProperty({
    description: "The rating of the course",
    type: Number,
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: "The comment of the course",
    type: String,
    example: "This course is amazing",
  })
  @IsNotEmpty()
  comment: string;
}
