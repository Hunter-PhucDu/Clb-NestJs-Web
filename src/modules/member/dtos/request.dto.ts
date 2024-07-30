import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PaginationDto } from 'modules/shared/dtos/pagination.dto';
import { ECommittee } from 'modules/shared/enums/committee.enum';
import { IsEmailOrPhone } from 'modules/shared/decorators/is-email-or-phone.decorator';
import { ESex } from 'modules/shared/enums/sex.enum';
import { IsPhone } from 'modules/shared/decorators/is-phone.docorator';

@Exclude()
export class AddMemberRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

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
    example: 'K62 ĐH CNTTA',
  })
  @IsNotEmpty()
  class: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0378886868',
  })
  @IsNotEmpty()
  @IsEmailOrPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone: string;

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

  @ApiProperty({ enum: ESex, default: ESex.FEMALE })
  @Expose()
  @IsNotEmpty()
  @IsEnum(ESex)
  sex: ESex;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '1/1/2000',
  })
  @IsNotEmpty()
  dateOfBirth: Date;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '20/6/2024',
  })
  @IsNotEmpty()
  joinedDate: Date;

  @ApiProperty({ enum: ECommittee, default: ECommittee.Member })
  @Expose()
  @IsOptional()
  @IsEnum(ECommittee)
  committee?: ECommittee;
}

@Exclude()
export class UpdateMemberRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  @IsOptional()
  fullName?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'K62 ĐH CNTTA',
  })
  @IsOptional()
  class?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0378886868',
  })
  @IsOptional()
  @IsPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc@gmail.com',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Email is not valid',
  })
  @Transform(({ value }) => value?.trim())
  email?: string;

  @ApiProperty({ enum: ESex, default: ESex.FEMALE })
  @Expose()
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

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '20/6/2024',
  })
  @IsOptional()
  joinedDate?: Date;

  @ApiProperty({ enum: ECommittee, default: ECommittee.Member })
  @Expose()
  @IsOptional()
  @IsEnum(ECommittee)
  committee?: ECommittee;
}

export class GetMembersRequestDto extends PaginationDto {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by name or class',
  })
  @IsOptional()
  search?: string;
}
