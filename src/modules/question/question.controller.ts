import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResponseDto, QuestionsResponseDto } from './dtos/response.dto';
import { AddQuestionRequestDto, UpdateQuestionRequestDto } from './dtos/request.dto';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiSuccessPaginationResponse,
  ApiSuccessResponse,
} from 'modules/shared/decorators/api-success-response.decorator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';
import { ERole } from 'modules/shared/enums/auth.enum';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { plainToInstance } from 'class-transformer';

@Controller('questions')
@ApiTags('Questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Add new question',
    description: 'Add new question',
  })
  @ApiBody({
    description: 'Add new question',
    type: AddQuestionRequestDto,
  })
  @ApiSuccessResponse({ dataType: QuestionResponseDto })
  async createProduct(@Body() body: AddQuestionRequestDto): Promise<QuestionResponseDto> {
    return await this.questionService.addQuestion(body);
  }

  @Put(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Updating question',
    description: 'Updating question',
  })
  @ApiBody({
    description: 'Update question form-data',
    type: UpdateQuestionRequestDto,
  })
  @ApiSuccessResponse({ dataType: QuestionResponseDto })
  async updateQuestion(
    @Param('questionId', new ValidateObjectId()) questionId: string,
    @Body() body: UpdateQuestionRequestDto,
  ): Promise<QuestionResponseDto> {
    const res = await this.questionService.updateQuestion(questionId, body);
    return plainToInstance(QuestionResponseDto, res);
  }

  @Get(':questionId')
  @ApiOperation({
    summary: 'Get question  details',
    description: 'Get question  details',
  })
  @ApiSuccessResponse({ dataType: QuestionResponseDto })
  async getCourse(@Param('questionId', new ValidateObjectId()) questionId: string): Promise<QuestionResponseDto> {
    return await this.questionService.getQuestion(questionId);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get questions  details',
    description: 'Get questions  details',
  })
  @ApiSuccessPaginationResponse({ dataType: QuestionsResponseDto })
  async getQuestions(): Promise<QuestionResponseDto[]> {
    return await this.questionService.getQuestions();
  }

  @Delete(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Remove question',
    description: 'Remove question',
  })
  async removeUsersInCourse(@Param('questionId', new ValidateObjectId()) questionId: string): Promise<void> {
    await this.questionService.removeQuestion(questionId);
  }
}
