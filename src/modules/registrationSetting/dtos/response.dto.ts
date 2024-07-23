import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegistrationSettingResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: Boolean,
    example: false,
  })
  isRegistrationOpen: boolean;

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
