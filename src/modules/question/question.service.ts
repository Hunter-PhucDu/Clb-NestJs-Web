import { BadRequestException, Injectable } from '@nestjs/common';
import { AddQuestionRequestDto, UpdateQuestionRequestDto } from './dtos/request.dto';
import { QuestionResponseDto } from './dtos/response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { QuestionModel } from 'modules/shared/models/question.model';

@Injectable()
export class QuestionService {
  constructor(private readonly questionModel: QuestionModel) {}
  async addQuestion(addQuestionDto: AddQuestionRequestDto): Promise<QuestionResponseDto> {
    try {
      const newQuestion = await this.questionModel.save({ ...addQuestionDto });

      return plainToInstance(QuestionResponseDto, newQuestion.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while add new Question: ${error.message}`);
    }
  }

  async updateQuestion(questionId: string, updateQuestionDto: UpdateQuestionRequestDto): Promise<QuestionResponseDto> {
    try {
      const updatedQuestion = await this.questionModel.model.findOneAndUpdate(
        { _id: questionId },
        { $set: updateQuestionDto },
        { new: true },
      );

      if (!updatedQuestion) {
        throw new BadRequestException('Question not found');
      }

      return plainToClass(QuestionResponseDto, updatedQuestion.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating Question: ${error.message}`);
    }
  }

  async getQuestion(questionId: string): Promise<QuestionResponseDto> {
    try {
      const questionDoc = await this.questionModel.model.findById(questionId);
      if (!questionDoc) {
        throw new BadRequestException('Question  does not exist');
      }
      return plainToInstance(QuestionResponseDto, questionDoc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while get question details: ${e.message}`);
    }
  }

  async getQuestions(): Promise<QuestionResponseDto[]> {
    try {
      const questionsDoc = await this.questionModel.model.find().exec();
      return questionsDoc.map((doc) => doc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while getting question: ${e.message}`);
    }
  }

  async removeQuestion(questionId: string): Promise<void> {
    try {
      const questionDoc = await this.questionModel.model.findById(questionId);
      if (!questionDoc) throw new BadRequestException('Question  does not exist');
      await this.questionModel.model.findByIdAndRemove(questionId);
    } catch (e) {
      throw new BadRequestException(`Error while deleting question : ${e.message}`);
    }
  }
}
