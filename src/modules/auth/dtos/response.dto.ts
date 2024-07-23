import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class LoginResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '0x123...',
  })
  accessToken: string;
}
