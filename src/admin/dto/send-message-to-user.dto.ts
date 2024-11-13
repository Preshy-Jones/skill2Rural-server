import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageToUserDto {
  @ApiProperty({
    description: "The message to be sent to all users",
    type: String,
    example: "Hello, this is a test message",
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
