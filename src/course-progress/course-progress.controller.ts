import { Controller, Body, Put, Get, Request, Param } from "@nestjs/common";
import { CourseProgressService } from "./course-progress.service";

import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateCourseProgressDto } from "./dto/update-course-progress.dto";

@Controller("course-progress")
export class CourseProgressController {
  constructor(private readonly courseProgressService: CourseProgressService) {}

  @Put(":courseId")
  @ApiTags("Update Course Progress")
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiBody({
    type: UpdateCourseProgressDto,
    description: "Json structure for course progress object",
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: "Forbidden" })
  updateCourseProgress(
    @Param("courseId") courseId: string,
    @Request() req,
    @Body() updateCourseProgressDto: UpdateCourseProgressDto,
  ) {
    return this.courseProgressService.updateCourseProgress(
      updateCourseProgressDto,
      req.user.id,
      parseInt(courseId),
    );
  }

  @ApiTags("Get Course Progress")
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  @Get(":courseId")
  getCourseProgress(@Param("courseId") courseId: string, @Request() req) {
    return this.courseProgressService.getCourseProgress(
      req.user.id,
      parseInt(courseId),
    );
  }
}
