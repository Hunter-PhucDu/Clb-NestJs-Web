import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { QuestionDto } from './request.dto';
import { ESex } from 'modules/shared/enums/sex.enum';
import { IsEnum, ValidateNested } from 'class-validator';

@Exclude()
export class RegistrationResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  fullName: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'K62 ĐH CNTTA',
  })
  class: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0371234567',
  })
  phone?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc123@gmail.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    enum: ESex,
    default: ESex.FEMALE,
  })
  @IsEnum(ESex)
  sex?: ESex;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '1/1/2000',
  })
  dateOfBirth?: Date;

  @ApiProperty({ type: [QuestionDto], required: false })
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];

  @Expose()
  @ApiProperty({
    required: true,
    type: Boolean,
    example: false,
  })
  passedFirstRound: boolean;

  @Expose()
  @ApiProperty({
    required: true,
    type: Boolean,
    example: false,
  })
  passedSecondRound: boolean;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2024-01-05T16:40:14.532+00:00',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2024-01-05T16:40:14.532+00:00',
  })
  @Expose()
  updatedAt: Date;
}
