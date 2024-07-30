import { BadRequestException, Injectable } from '@nestjs/common';
import { PostResponseDto } from './dtos/response.dto';
import { PostModel } from 'modules/shared/models/post.model';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  AddPostRequestDto,
  GetPostsBySearchRequestDto,
  GetPostsRequestDto,
  UpdatePostRequestDto,
} from './dtos/request.dto';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from 'modules/shared/dtos/metadata-response.dto';
import { getPagination } from 'modules/shared/utils/get-pagination';

@Injectable()
export class PostService {
  constructor(private readonly postModel: PostModel) {}

  async addPost(createPostDto: AddPostRequestDto): Promise<PostResponseDto> {
    const { richTextContent } = createPostDto;

    // extract media from richTextContent
    const images = this.extractMedia(richTextContent, 'image');
    const videos = this.extractMedia(richTextContent, 'video');

    const newPost = await this.postModel.save({
      ...createPostDto,
      images,
      videos,
      published: false,
    });

    return plainToClass(PostResponseDto, newPost.toObject());
  }

  private extractMedia(content: any, type: string): string[] {
    const mediaUrls: string[] = [];
    if (content.blocks) {
      content.blocks.forEach((block) => {
        if (block.type === type) {
          mediaUrls.push(block.data.file.url);
        }
      });
    }
    return mediaUrls;
  }

  async updatePost(postId: string, updatePost: UpdatePostRequestDto): Promise<PostResponseDto> {
    try {
      const postDoc = await this.postModel.model.findOneAndUpdate({ _id: postId }, { $set: updatePost }, { new: true });

      if (!postDoc) {
        throw new BadRequestException('Post does not exist');
      }

      return plainToClass(PostResponseDto, postDoc.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating Post: ${error.message}`);
    }
  }

  async publishPost(postId: string): Promise<PostResponseDto> {
    try {
      const postDoc = await this.postModel.model.findOneAndUpdate({ _id: postId }, { published: true }, { new: true });

      if (!postDoc) {
        throw new BadRequestException('Post does not exist');
      }

      return plainToClass(PostResponseDto, postDoc.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while publish Post: ${error.message}`);
    }
  }

  async getPost(postId: string): Promise<PostResponseDto> {
    const postDoc = await this.postModel.model.findById(postId);
    return plainToInstance(PostResponseDto, postDoc.toObject());
  }

  async getPosts(paginationDto: GetPostsRequestDto): Promise<ListRecordSuccessResponseDto<PostResponseDto>> {
    const { page, size } = paginationDto;
    const skip = (page - 1) * size;

    const [posts, totalItem] = await Promise.all([
      this.postModel.model.find().skip(skip).limit(size).exec(),
      this.postModel.model.countDocuments(),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const postResponseDtos: PostResponseDto[] = plainToInstance(PostResponseDto, posts);

    return {
      metadata,
      data: postResponseDtos,
    };
  }

  async getPostsBySearch(
    paginationDto: GetPostsBySearchRequestDto,
  ): Promise<ListRecordSuccessResponseDto<PostResponseDto>> {
    const { page, size, search } = paginationDto;
    const skip = (page - 1) * size;

    const searchCondition = search
      ? { $or: [{ title: { $regex: new RegExp(search, 'i') } }, { author: { $regex: new RegExp(search, 'i') } }] }
      : {};

    const [posts, totalItem] = await Promise.all([
      this.postModel.model.find(searchCondition).skip(skip).limit(size).exec(),
      this.postModel.model.countDocuments(searchCondition),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const postResponseDtos: PostResponseDto[] = plainToInstance(PostResponseDto, posts);

    return {
      metadata,
      data: postResponseDtos,
    };
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const deletedpost = await this.postModel.model.findOneAndDelete({ _id: postId });

      if (!deletedpost) {
        throw new BadRequestException('post not found');
      }
    } catch (error) {
      throw new BadRequestException(`Error while deleting post: ${error.message}`);
    }
  }
}
