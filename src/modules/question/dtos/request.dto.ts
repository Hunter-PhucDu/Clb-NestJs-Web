import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationDto } from 'modules/shared/dtos/pagination.dto';

@Exclude()
export class AddQuestionRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Bạn biết đến clb từ đâu?',
  })
  @IsNotEmpty()
  question: string;
}

@Exclude()
export class UpdateQuestionRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Bạn mong muốn gì khi tham gia clb?',
  })
  @IsNotEmpty()
  question: string;
}

export class GetQuestionsRequestDto extends PaginationDto {}
