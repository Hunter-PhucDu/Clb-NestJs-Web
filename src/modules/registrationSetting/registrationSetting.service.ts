import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegistrationSettingModel } from '../shared/models/registrationSetting.model';
import { RegistrationSettingRequestDto } from './dtos/request.dto';
import { RegistrationSettingResponseDto } from './dtos/response.dto';

@Injectable()
export class RegistrationSettingService {
  constructor(private readonly registrationSettingModel: RegistrationSettingModel) {}

  async onModuleInit() {
    const setting = await this.registrationSettingModel.model.findOne().exec();
    if (!setting) {
      const defaultSetting = new this.registrationSettingModel.model({
        isRegistrationOpen: false,
      });
      await defaultSetting.save();
    }
  }

  async getStatus(): Promise<RegistrationSettingResponseDto> {
    try {
      const setting = await this.registrationSettingModel.model.findOne().exec();

      return plainToInstance(RegistrationSettingResponseDto, setting.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while getting status: ${error.message}`);
    }
  }

  async setStatus(registrationSettingDto: RegistrationSettingRequestDto): Promise<RegistrationSettingResponseDto> {
    try {
      const setStatus = await this.registrationSettingModel.model
        .findOneAndUpdate(
          {},
          { isRegistrationOpen: registrationSettingDto.isRegistrationOpen },
          { upsert: true, new: true },
        )
        .exec();

      return plainToInstance(RegistrationSettingResponseDto, setStatus.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while setting registration status: ${error.message}`);
    }
  }
}
