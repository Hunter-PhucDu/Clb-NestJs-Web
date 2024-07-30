import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { TransformMongoId } from 'modules/shared/decorators/transform.decorator';
import { ECommittee } from 'modules/shared/enums/committee.enum';
import { ESex } from 'modules/shared/enums/sex.enum';
import { Types } from 'mongoose';

@Exclude()
export class MemberResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abcd...',
  })
  @TransformMongoId()
  _id: Types.ObjectId;

  @Expose()
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  avatar?: any;

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
    example: '0378886868',
  })
  phone: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc@gmail.com',
  })
  email: string;

  @ApiProperty({ enum: ESex, default: ESex.FEMALE })
  @Expose()
  @IsEnum(ESex)
  sex: ESex;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '1/1/2000',
  })
  dateOfBirth: Date;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '20/6/2024',
  })
  joinedDate: Date;

  @ApiProperty({ enum: ECommittee, default: ECommittee.Member })
  @Expose()
  @IsEnum(ECommittee)
  committee?: ECommittee;
}
