import { Controller, Post, Get, Param, Delete, UseGuards, Body, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponseDto } from './dtos/response.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiSuccessPaginationResponse,
  ApiSuccessResponse,
} from 'modules/shared/decorators/api-success-response.decorator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ERole } from 'modules/shared/enums/auth.enum';
import { AddPostRequestDto, GetPostsRequestDto, UpdatePostRequestDto } from './dtos/request.dto';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('Posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Add new post',
    description: 'Add new post',
  })
  @ApiBody({
    description: 'Add new post form-data',
    type: AddPostRequestDto,
  })
  @ApiSuccessResponse({ dataType: PostResponseDto })
  async addPost(@Body() body: AddPostRequestDto): Promise<PostResponseDto> {
    return await this.postService.addPost(body);
  }

  @Get(':postId')
  @ApiOperation({
    summary: 'Get post details',
    description: 'Get post details',
  })
  @ApiSuccessResponse({ dataType: PostResponseDto })
  async getPost(@Param('postId') postId: string): Promise<PostResponseDto> {
    return await this.postService.getPost(postId);
  }

  @Put(':postId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Passed first round',
    description: 'Update Post passed first round',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Post form-data',
    type: UpdatePostRequestDto,
  })
  @ApiSuccessResponse({ dataType: PostResponseDto })
  async updatePassedFirstRound(
    @Param('postId') postId: string,
    @Body() body: UpdatePostRequestDto,
  ): Promise<PostResponseDto> {
    const res = await this.postService.updatePost(postId, body);
    return plainToInstance(PostResponseDto, res);
  }

  @Put(':postId/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Publish the Post',
    description: 'Publish the Post',
  })
  @ApiSuccessResponse({ dataType: PostResponseDto })
  async updatePassedSecondRound(@Param('postId') postId: string): Promise<PostResponseDto> {
    const res = await this.postService.publishPost(postId);
    return plainToInstance(PostResponseDto, res);
  }

  @Get('')
  @ApiSuccessPaginationResponse({ dataType: PostResponseDto })
  async getPosts(): Promise<PostResponseDto[]> {
    return await this.postService.getPosts();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Get pagination posts',
    description: 'Get pagination posts',
  })
  @ApiSuccessPaginationResponse({ dataType: PostResponseDto })
  async findWithPagination(
    @Query() getPostsRequestDto: GetPostsRequestDto,
  ): Promise<ListRecordSuccessResponseDto<PostResponseDto>> {
    return await this.postService.getPostsBySearch(getPostsRequestDto);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete post',
  })
  async deletePost(@Param('postId') postId: string): Promise<void> {
    await this.postService.deletePost(postId);
  }
}
