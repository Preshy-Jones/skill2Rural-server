import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  // model Course {
  //   id          Int              @id @default(autoincrement())
  //   title       String
  //   description String
  //   thumbnail_image String
  //   video_url   String
  //   createdAt   DateTime         @default(now())
  //   updatedAt   DateTime         @updatedAt

  // }

  @ApiProperty({
    description: "The title of the course",
    type: String,
    example: "Introduction to GraphQL",
  })
  title: string;

  @ApiProperty({
    description: "The description of the course",
    type: String,
    example: "Learn the basics of GraphQL",
  })
  description: string;

  @ApiProperty({
    description: "The thumbnail image of the course",
    type: String,
    example: "https://example.com/thumbnail.jpg",
  })
  thumbnail_image: string;

  @ApiProperty({
    description: "The video url of the course",
    type: String,
    example: "https://example.com/video.mp4",
  })
  video_url: string;
}
