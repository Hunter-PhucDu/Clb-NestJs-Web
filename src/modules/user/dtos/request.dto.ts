import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { IsEmailOrPhone } from '../../../modules/shared/decorators/is-email-or-phone.decorator';
import { PaginationDto } from '../../../modules/shared/dtos/pagination.dto';
import { ESex } from 'modules/shared/enums/sex.enum';
import { IsPhone } from 'modules/shared/decorators/is-phone.docorator';

@Exclude()
export class AddUserRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'VanA123',
  })
  @IsNotEmpty()
  userName: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  @IsNotEmpty()
  fullName: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc@gmail.com',
  })
  @IsNotEmpty()
  @IsEmailOrPhone({
    message: 'Email is not valid',
  })
  @Transform(({ value }) => value?.trim())
  email: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '******',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[^\s]*$/, {
    message: 'Password should not contain spaces.',
  })
  password: string;
}

@Exclude()
export class UpdateUserRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    example: 'Nguyen Van B',
  })
  @IsOptional()
  fullName?: string;

  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    example: '0371234567',
  })
  @IsOptional()
  @IsPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    example: 'abc123@gmail.com',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Email is not valid',
  })
  @Transform(({ value }) => value?.trim())
  email?: string;

  @Expose()
  @ApiProperty({
    required: false,
    enum: ESex,
  })
  @IsOptional()
  @IsEnum(ESex)
  sex?: ESex;

  @Expose()
  @ApiProperty({
    required: false,
    type: Date,
    example: '1/1/2000',
  })
  @IsOptional()
  dateOfBirth?: Date;
}

@Exclude()
export class ChangePasswordRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '******',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[^\s]*$/, {
    message: 'Password should not contain spaces.',
  })
  password: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '******',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[^\s]*$/, {
    message: 'Password should not contain spaces.',
  })
  newPassword: string;
}

@Exclude()
export class GetUsersRequestDto extends PaginationDto {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by fullName or email',
  })
  @IsOptional()
  search?: string;
}
