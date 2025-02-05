import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationDto } from 'modules/shared/dtos/pagination.dto';

@Exclude()
export class AddPostRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Sự kiện mới',
  })
  @IsNotEmpty()
  title: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Object,
    example: 'html',
  })
  @IsNotEmpty()
  richTextContent: any;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Clb Lập trình',
  })
  @IsNotEmpty()
  author: string;
}

@Exclude()
export class UpdatePostRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Sự kiện mới',
  })
  @IsOptional()
  title?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: JSON,
    example: 'html',
  })
  @IsOptional()
  richTextContent: any;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Clb Lập trình',
  })
  @IsOptional()
  author?: string;
}

@Exclude()
export class GetPostsRequestDto extends PaginationDto {}

@Exclude()
export class GetPostsBySearchRequestDto extends PaginationDto {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by title or author',
  })
  @IsOptional()
  search?: string;
}
