import { Body, Controller, Post, Put, Delete, UseGuards, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ApiSuccessPaginationResponse, ApiSuccessResponse } from '../shared/decorators/api-success-response.decorator';
import { Roles } from '../shared/decorators/role.decorator';
import { ERole } from '../shared/enums/auth.enum';
import { JwtAuthGuard } from '../shared/gaurds/jwt.guard';
import { RolesGuard } from '../shared/gaurds/role.gaurd';
import { AddRegistrationRequestDto, GetRegistrationsRequestDto, PassedFirstRoundRequestDto } from './dtos/request.dto';
import { RegistrationResponseDto } from './dtos/response.dto';
import { RegistrationService } from './registration.service';

import { ListRecordSuccessResponseDto } from '../shared/dtos/list-record-success-response.dto';

@Controller('registrations')
@ApiTags('Registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('')
  @ApiOperation({
    summary: 'Add new registration',
    description: 'Add new registration',
  })
  @ApiBody({
    description: 'Add new registration form-data',
    type: AddRegistrationRequestDto,
  })
  @ApiSuccessResponse({ dataType: RegistrationResponseDto })
  async addRegistration(@Body() body: AddRegistrationRequestDto): Promise<RegistrationResponseDto> {
    return await this.registrationService.addRegistration(body);
  }

  @Get(':registrationId')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get registration details',
    description: 'Get registration details',
  })
  @ApiSuccessResponse({ dataType: RegistrationResponseDto })
  async getRegistration(@Param('registrationId') registrationId: string): Promise<RegistrationResponseDto> {
    return await this.registrationService.getRegistration(registrationId);
  }

  @Put(':registrationId/passedFirstRound')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Passed first round',
    description: 'Update registration passed first round',
  })
  @ApiSuccessResponse({ dataType: RegistrationResponseDto })
  async updatePassedFirstRound(
    @Param('registrationId') registrationId: string,
    @Body() body: PassedFirstRoundRequestDto,
  ): Promise<RegistrationResponseDto> {
    const res = await this.registrationService.updatePassedFirstRound(registrationId, body);
    return plainToInstance(RegistrationResponseDto, res);
  }

  @Put(':registrationId/passedSecondRound')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Passed second round',
    description: 'Update registration passed first round',
  })
  @ApiSuccessResponse({ dataType: RegistrationResponseDto })
  async updatePassedSecondRound(@Param('registrationId') registrationId: string): Promise<RegistrationResponseDto> {
    const res = await this.registrationService.updatePassedSecondRound(registrationId);
    return plainToInstance(RegistrationResponseDto, res);
  }

  @Get('')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get registrations details',
    description: 'Change registrations details',
  })
  @ApiSuccessPaginationResponse({ dataType: RegistrationResponseDto })
  async getMembers(): Promise<RegistrationResponseDto[]> {
    return await this.registrationService.getRegistrations();
  }

  @Get('search')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get pagination registrations',
    description: 'Get pagination registrations',
  })
  @ApiSuccessPaginationResponse({ dataType: RegistrationResponseDto })
  async findWithPagination(
    @Query() getRegistrationsRequestDto: GetRegistrationsRequestDto,
  ): Promise<ListRecordSuccessResponseDto<RegistrationResponseDto>> {
    return await this.registrationService.getRegistrationsBySearch(getRegistrationsRequestDto);
  }

  @Delete(':registrationId')
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete registration',
    description: 'Delete registration',
  })
  async deleteRegistration(@Param('registrationId') registrationId: string): Promise<void> {
    await this.registrationService.deleteRegistration(registrationId);
  }
}
