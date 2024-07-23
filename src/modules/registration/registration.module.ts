import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { QuestionModule } from '../../modules/question/question.module';
import { EmailModule } from 'modules/email/email.module';
import { RegistrationSettingModule } from 'modules/registrationSetting/registrationSetting.module';

@Module({
  imports: [SharedModule, QuestionModule, EmailModule, RegistrationSettingModule],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
