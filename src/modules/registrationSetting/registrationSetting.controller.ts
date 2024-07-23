import { Body, Controller, Put, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../shared/decorators/api-success-response.decorator';
import { Roles } from '../shared/decorators/role.decorator';
import { ERole } from '../shared/enums/auth.enum';
import { JwtAuthGuard } from '../shared/gaurds/jwt.guard';
import { RolesGuard } from '../shared/gaurds/role.gaurd';
import { RegistrationSettingRequestDto } from './dtos/request.dto';
import { RegistrationSettingResponseDto } from './dtos/response.dto';
import { RegistrationSettingService } from './registrationSetting.service';

@Controller('registration-settings')
@ApiTags('Registration-settings')
export class RegistrationSettingController {
  constructor(private readonly registrationSettingService: RegistrationSettingService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get registration status',
    description: 'Get current registration status',
  })
  @ApiSuccessResponse({ dataType: RegistrationSettingResponseDto })
  async getStatus(): Promise<RegistrationSettingResponseDto> {
    return this.registrationSettingService.getStatus();
  }

  @Put('')
  @Roles([ERole.ADMIN])
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Set registration status',
    description: 'Set the registration status',
  })
  @ApiBody({
    description: 'Set registration status request body',
    type: RegistrationSettingRequestDto,
  })
  @ApiSuccessResponse({ dataType: RegistrationSettingResponseDto })
  async setStatus(
    @Body() registrationSettingDto: RegistrationSettingRequestDto,
  ): Promise<RegistrationSettingResponseDto> {
    return this.registrationSettingService.setStatus(registrationSettingDto);
  }
}
