import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class QuestionResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Bạn biết đến clb từ đâu?',
  })
  question: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Mình biết đến clb từ mạng xã hội.',
  })
  answer?: string;
}

@Exclude()
export class QuestionsResponseDto {
  @Expose()
  @Type(() => QuestionResponseDto)
  @ApiProperty({
    type: [QuestionResponseDto],
  })
  Questions: QuestionResponseDto[];
}
