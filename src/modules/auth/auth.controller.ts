import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  GenerateOtpDto,
  LoginRequestDto,
  LogOutRequestDto,
  RefreshTokenRequestDto,
} from './dtos/request.dto';
import { LoginResponseDto } from './dtos/response.dto';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { EmailService } from 'modules/email/email.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  userService: any;
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('admin/sign-in')
  @ApiOperation({
    summary: 'Login for admin',
    description: 'Login for admin',
  })
  @ApiSuccessResponse({ dataType: LoginResponseDto })
  async loginAdmin(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.loginAdmin(loginDto);
  }

  @Post('user/sign-in')
  @ApiOperation({
    summary: 'Login for user',
    description: 'Login for user',
  })
  @ApiSuccessResponse({ dataType: LoginResponseDto })
  async loginUser(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.loginUser(loginDto);
  }

  @Post('generate-otp')
  @ApiOperation({
    summary: 'Creat opt for forgot passwword',
    description: 'Creat opt for forgot passwword',
  })
  async generateOtp(@Body() generateOtpDto: GenerateOtpDto): Promise<void> {
    return this.emailService.generateOtp(generateOtpDto.email);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot passwword',
    description: 'Change password for forgot passwword',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out a user' })
  async logOut(@Body() logOutDto: LogOutRequestDto): Promise<void> {
    return this.authService.logOut(logOutDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<string> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
