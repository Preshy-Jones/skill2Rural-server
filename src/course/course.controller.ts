import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CourseService } from "./course.service";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { AddCourseReviewDto } from "./dto/add-course-review.dto";
import { Public } from "src/common/decorators/jwt-auth-guard.decorator";
// import { AddQuestionDto } from "./dto/add-question.dto";
// import { CreateCertificateDto } from "./dto/create-certificate.dto";

@ApiTags("Course")
@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Public()
  @ApiOperation({
    summary: "Get all courses",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.courseService.findAll();
  }
  // Get User's enrolled courses
  @Get("enrolled")
  @ApiOperation({
    summary: "Get User Enrolled Courses",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiBearerAuth()
  getUserEnrolledCourses(@Request() req) {
    const userId = req.user.id;
    return this.courseService.getUserEnrolledCourses(userId);
  }

  @Public()
  @Get("public/:id")
  @ApiOperation({
    summary: "Get Course by ID(Public)",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  publicFindOneCourse(@Param("id") id: string) {
    return this.courseService.findOne(+id);
  }

  @Get(":id")
  @ApiTags("Find Course by ID")
  @ApiResponse({
    status: 200,
    description: "The record has been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  findOneCourse(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    return this.courseService.getSingleCourse(+id, userId);
  }

  @ApiBearerAuth()
  @Patch(":id")
  updateCourse(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Get("reviews/:courseId")
  @ApiOperation({
    summary: "Get Course Reviews",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  getCourseReviews(@Param("courseId") courseId: string) {
    return this.courseService.findReviewsByCourseId(+courseId);
  }

  @Post("reviews/:courseId")
  @ApiOperation({
    summary: "Add Course Review",
  })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiBody({
    type: AddCourseReviewDto,
    description: "Json structure for course review object",
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: "Forbidden" })
  addCourseReview(
    @Param("courseId") courseId: string,
    @Body() data: AddCourseReviewDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.courseService.addCourseReview(+courseId, userId, data);
  }
}
