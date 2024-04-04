import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEducatorDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'Precious',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'adedibuprecious@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The organisation of the educator',
    type: String,
    example: 'Nafdac',
  })
  @IsNotEmpty()
  @IsString()
  organisation: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The number of students the educator wants to reach',
    type: Number,
    example: 4,
  })
  @IsNotEmpty()
  @IsString()
  no_of_students_to_reach: string;

  @ApiProperty({
    description: 'Does the educator work with marginalized populations?',
    type: Boolean,
    example: 'true',
  })
  @IsNotEmpty()
  @IsString()
  work_with_maginalized_populations: boolean;
}
