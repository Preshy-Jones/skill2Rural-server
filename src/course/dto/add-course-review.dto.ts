import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class AddCourseReviewDto {
  @ApiProperty({
    description: "The rating of the course",
    type: Number,
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  rating: number;

  @ApiProperty({
    description: "The comment of the course",
    type: String,
    example: "This course is amazing",
  })
  @IsNotEmpty()
  comment: string;
}
