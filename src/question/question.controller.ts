import { Controller, Get, Post, Body, Param, Request } from "@nestjs/common";
import { QuestionService } from "./question.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AddQuestionDto } from "./dto/add-question.dto";
import { ProcessQuizDto } from "./dto/process-quiz.dto";

@ApiTags("Question")
@Controller("questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post("question/:courseId")
  @ApiOperation({
    summary: "Add new question",
  })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiBody({
    type: AddQuestionDto,
    description: "Json structure for question object",
  })
  @ApiBearerAuth()
  addNewQuestion(
    @Param("courseId") courseId: string,
    @Body() data: AddQuestionDto,
  ) {
    return this.questionService.addNewQuestion(+courseId, data);
  }

  @Get("question/:courseId")
  @ApiOperation({
    summary: "Get Questions",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  getQuestions(@Param("courseId") courseId: string, @Request() req) {
    return this.questionService.getQuestions(+courseId, req.user.id);
  }

  // Get User's Certificates
  @Get("certificate")
  @ApiOperation({
    summary: "Get User Certificates",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiBearerAuth()
  getUserCertificates(@Request() req) {
    const userId = req.user.id;
    return this.questionService.getUserCertificates(userId);
  }

  // Get User's course certificate
  @Get("certificate/:courseId")
  @ApiOperation({
    summary: "Get User Course Certificate",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully retrieved.",
  })
  @ApiBearerAuth()
  getUserCourseCertificate(
    @Param("courseId") courseId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.questionService.getUserCertificate(+courseId, userId);
  }

  //create certificate
  @Post("quiz/:courseId")
  @ApiOperation({
    summary: "Process Quiz",
  })
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiBearerAuth()
  processQuiz(
    @Param("courseId") courseId: string,
    @Request() req,
    @Body() data: ProcessQuizDto,
  ) {
    const userId = req.user.id;
    return this.questionService.processQuiz(+courseId, userId, data);
  }

  // Get User's Quiz Results
  @Get("quiz/:courseId")
  @ApiOperation({
    summary: "Get User Quiz Results",
  })
  @ApiResponse({
    status: 200,
    description: "The records have been successfully retrieved.",
  })
  @ApiBearerAuth()
  getUserQuizResults(@Param("courseId") courseId: string, @Request() req) {
    const userId = req.user.id;
    return this.questionService.getUserQuizResults(+courseId, userId);
  }

  // Get User's Best Quiz Result
  @Get("quiz/best/:courseId")
  @ApiOperation({
    summary: "Get User Best Quiz Result",
  })
  @ApiResponse({
    status: 200,
    description: "The record has been successfully retrieved.",
  })
  @ApiBearerAuth()
  getUserBestQuizResult(@Param("courseId") courseId: string, @Request() req) {
    const userId = req.user.id;
    return this.questionService.getUserBestQuizResult(+courseId, userId);
  }
}
