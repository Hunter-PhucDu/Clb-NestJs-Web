import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsEmailOrPhone } from '../../../modules/shared/decorators/is-email-or-phone.decorator';
import { PaginationDto } from '../../../modules/shared/dtos/pagination.dto';
import { ESex } from 'modules/shared/enums/sex.enum';

@Exclude()
export class QuestionDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  answer?: string;
}

@Exclude()
export class AddRegistrationRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  @IsOptional()
  fullName: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'K62 ĐH CNTTA',
  })
  @IsNotEmpty()
  class: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0371234567',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc123@gmail.com',
  })
  @IsNotEmpty()
  @IsEmailOrPhone({
    message: 'Email is not valid',
  })
  @Transform(({ value }) => value?.trim())
  email: string;

  @Expose()
  @ApiProperty({
    enum: ESex,
    default: ESex.FEMALE,
  })
  @IsOptional()
  @IsEnum(ESex)
  sex?: ESex;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '1/1/2000',
  })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({ type: [QuestionDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}

@Exclude()
export class PassedFirstRoundRequestDto {
  @Expose()
  @ApiProperty({ type: String, required: true, example: '9 giờ 30 phút.  Ngày 29/4/2024' })
  @IsNotEmpty()
  dateTime: string;

  @Expose()
  @ApiProperty({ type: String, required: true, example: 'Phòng A404, Nhà A, trường ĐẠI học Tây Bắc' })
  @IsNotEmpty()
  address: string;
}

@Exclude()
export class GetRegistrationsRequestDto extends PaginationDto {}

@Exclude()
export class GetRegistrationsBySearchRequestDto extends PaginationDto {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by fullName or class',
  })
  @IsOptional()
  search?: string;
}
