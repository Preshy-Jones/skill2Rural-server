import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCertificateDto {
  @ApiProperty({
    description: "The course ID of the certificate",
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({
    description: "The user ID of the certificate",
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: "The grade of the certificate",
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  gradeInPercentage: number;
}
