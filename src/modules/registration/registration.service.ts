import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ListRecordSuccessResponseDto } from '../shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from '../shared/dtos/metadata-response.dto';
import { RegistrationModel } from '../shared/models/registration.model';
import { getPagination } from '../shared/utils/get-pagination';
import {
  AddRegistrationRequestDto,
  GetRegistrationsBySearchRequestDto,
  PassedFirstRoundRequestDto,
} from './dtos/request.dto';
import { RegistrationResponseDto } from './dtos/response.dto';
import { QuestionModel } from 'modules/shared/models/question.model';
import { EmailService } from 'modules/email/email.service';
import { RegistrationSettingService } from 'modules/registrationSetting/registrationSetting.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly registrationModel: RegistrationModel,
    private readonly questionModel: QuestionModel,
    private readonly emailService: EmailService,
    private readonly registrationSettingService: RegistrationSettingService,
  ) {}

  async addRegistration(addRegistrationDto: AddRegistrationRequestDto): Promise<RegistrationResponseDto> {
    try {
      const isOpen = await this.registrationSettingService.getStatus();

      if (!isOpen.isRegistrationOpen) {
        throw new BadRequestException('Registration is currently closed.');
      }

      const allQuestions = await this.questionModel.model.find().exec();

      const questionsObjects = allQuestions.map((q) => ({
        question: q.question,
        answer: '',
      }));

      const newRegistration = await this.registrationModel.save({
        ...addRegistrationDto,
        questions: questionsObjects,
        passedFirstRound: false,
        passedSecondRound: false,
      });

      await this.emailService._sendMailConfirmationRegistration(newRegistration.email, newRegistration.fullName);

      return plainToClass(RegistrationResponseDto, newRegistration.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while adding registration: ${error.message}`);
    }
  }

  async updatePassedFirstRound(
    registrationId: string,
    passedFirstRoundDto: PassedFirstRoundRequestDto,
  ): Promise<RegistrationResponseDto> {
    try {
      const existDoc = await this.registrationModel.model.findOne({ _id: registrationId });

      if (!existDoc) {
        throw new BadRequestException('Registration does not exist');
      }

      if (existDoc.passedFirstRound === true) {
        throw new BadRequestException('Registration is passed');
      }

      const registrationDoc = await this.registrationModel.model.findOneAndUpdate(
        { _id: registrationId },
        { passedFirstRound: true },
        { new: true },
      );

      if (!registrationDoc) {
        throw new BadRequestException('Registration does not exist');
      }
      await this.emailService._sendMailPassFirstRound(
        registrationDoc.email,
        registrationDoc.fullName,
        passedFirstRoundDto.dateTime,
        passedFirstRoundDto.address,
      );

      return plainToClass(RegistrationResponseDto, registrationDoc.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating passed first round: ${error.message}`);
    }
  }

  async updatePassedSecondRound(registrationId: string): Promise<RegistrationResponseDto> {
    try {
      const existDoc = await this.registrationModel.model.findOne({ _id: registrationId });

      if (!existDoc) {
        throw new BadRequestException('Registration does not exist');
      }

      if (existDoc.passedFirstRound === false) {
        throw new BadRequestException('Registration did not pass the first round');
      }

      if (existDoc.passedSecondRound === true) {
        throw new BadRequestException('Registration is passed');
      }

      const registrationDoc = await this.registrationModel.model.findOneAndUpdate(
        { _id: registrationId },
        { passedSecondRound: true },
        { new: true },
      );

      if (!registrationDoc) {
        throw new BadRequestException('Registration does not exist');
      }

      await this.emailService._sendMailPassedSecondRound(registrationDoc.email, registrationDoc.fullName);

      return plainToClass(RegistrationResponseDto, registrationDoc.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating passed second round: ${error.message}`);
    }
  }

  async getRegistration(registrationId: string): Promise<RegistrationResponseDto> {
    const registrationDoc = await this.registrationModel.model.findById(registrationId);
    return plainToInstance(RegistrationResponseDto, registrationDoc.toObject());
  }

  async getRegistrations(): Promise<RegistrationResponseDto[]> {
    try {
      const registrationsDoc = await this.registrationModel.model.find().exec();
      return registrationsDoc.map((doc) => doc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while getting registrations: ${e.message}`);
    }
  }

  async getRegistrationsBySearch(
    paginationDto: GetRegistrationsBySearchRequestDto,
  ): Promise<ListRecordSuccessResponseDto<RegistrationResponseDto>> {
    const { page, size, search } = paginationDto;
    const skip = (page - 1) * size;

    const searchCondition = search
      ? { $or: [{ fullName: { $regex: new RegExp(search, 'i') } }, { email: { $regex: new RegExp(search, 'i') } }] }
      : {};

    const [Registrations, totalItem] = await Promise.all([
      this.registrationModel.model.find(searchCondition).skip(skip).limit(size).exec(),
      this.registrationModel.model.countDocuments(searchCondition),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const registrationResponseDtos: RegistrationResponseDto[] = plainToInstance(RegistrationResponseDto, Registrations);

    return {
      metadata,
      data: registrationResponseDtos,
    };
  }

  async deleteRegistration(registrationId: string): Promise<void> {
    try {
      const deletedRegistration = await this.registrationModel.model.findOneAndDelete({ _id: registrationId });

      if (!deletedRegistration) {
        throw new BadRequestException('Registration not found');
      }
    } catch (error) {
      throw new BadRequestException(`Error while deleting registration: ${error.message}`);
    }
  }
}
