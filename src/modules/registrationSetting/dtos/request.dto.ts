import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class RegistrationSettingRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: Boolean,
    example: false,
  })
  @IsNotEmpty()
  isRegistrationOpen: boolean;
}
