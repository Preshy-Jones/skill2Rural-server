import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserType {
  Educator = 'EDUCATOR',
  Student = 'STUDENT',
}

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
    description: 'The type of the user',
    type: String,
    example: UserType.Educator,
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  type: string;

  @ApiProperty({
    description: 'The organisation of the user',
    type: String,
    example: 'Andela',
  })
  @IsNotEmpty()
  @IsString()
  organisation: string;

  @ApiProperty({
    description: 'The role of the user',
    type: String,
    example: 'Educator',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The number of students to reach',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  no_of_students_to_reach: number;

  @ApiProperty({
    description: 'Work with marginalized populations',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  work_with_maginalized_populations: boolean;
}
