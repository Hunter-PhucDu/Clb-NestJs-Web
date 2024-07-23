import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { RegistrationSettingController } from './registrationSetting.controller';
import { RegistrationSettingService } from './registrationSetting.service';

@Module({
  imports: [SharedModule],
  controllers: [RegistrationSettingController],
  providers: [RegistrationSettingService],
  exports: [RegistrationSettingService],
})
export class RegistrationSettingModule {}
