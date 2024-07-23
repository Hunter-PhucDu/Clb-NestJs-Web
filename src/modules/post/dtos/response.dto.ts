import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PostResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Cà phê',
  })
  title: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
    format: 'binary',
  })
  images?: any[];

  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
    format: 'binary',
  })
  videos?: any[];

  @Expose()
  @ApiProperty({
    required: true,
    type: Object,
    example: 'html',
  })
  richTextContent: any;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Clb Lập trình',
  })
  author: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Boolean,
    example: false,
  })
  published: boolean;

  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
    example: ['bài viết hay', 'rất hữu ích'],
  })
  comments?: string[];
}
