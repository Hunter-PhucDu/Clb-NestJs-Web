import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberResponseDto } from './dtos/response.dto';
import { AddMemberRequestDto, GetMembersRequestDto, UpdateMemberRequestDto } from './dtos/request.dto';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiSuccessPaginationResponse,
  ApiSuccessResponse,
} from 'modules/shared/decorators/api-success-response.decorator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';
import { ERole } from 'modules/shared/enums/auth.enum';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { plainToInstance } from 'class-transformer';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';

const memberAvatarStorageConfig: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileType = file.mimetype.split('/')[1];
      const destFileName = `memberAvatar-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileType}`;
      cb(null, destFileName);
    },
  }),
};

@Controller('members')
@ApiTags('Members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Add new member',
    description: 'Add new member',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', memberAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: MemberResponseDto })
  async createProduct(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: AddMemberRequestDto,
  ): Promise<MemberResponseDto> {
    return await this.memberService.addMember(body, avatar?.filename);
  }

  @Put(':memberId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Updating member',
    description: 'Updating member',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update member form-data',
    type: UpdateMemberRequestDto,
  })
  @UseInterceptors(FileInterceptor('avatar', memberAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: MemberResponseDto })
  async updateMember(
    @Param('memberId', new ValidateObjectId()) memberId: string,
    @Body() body: UpdateMemberRequestDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<MemberResponseDto> {
    const res = await this.memberService.updateMember(memberId, body, avatar?.filename);
    return plainToInstance(MemberResponseDto, res);
  }

  @Get('details/:memberId')
  @ApiOperation({
    summary: 'Get member  details',
    description: 'Get member  details',
  })
  @ApiSuccessResponse({ dataType: MemberResponseDto })
  async getCourse(@Param('memberId', new ValidateObjectId()) memberId: string): Promise<MemberResponseDto> {
    return await this.memberService.getMember(memberId);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get members details',
    description: 'Change members details',
  })
  @ApiSuccessPaginationResponse({ dataType: MemberResponseDto })
  async getMembers(): Promise<MemberResponseDto[]> {
    return await this.memberService.getMembers();
  }

  @Get('search')
  @ApiSuccessPaginationResponse({ dataType: MemberResponseDto })
  async findWithPagination(
    @Query() getMembersRequestDto: GetMembersRequestDto,
  ): Promise<ListRecordSuccessResponseDto<MemberResponseDto>> {
    return await this.memberService.getMembersBySearch(getMembersRequestDto);
  }

  @Delete(':memberId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Remove member',
    description: 'Remove member',
  })
  async removeUsersInCourse(@Param('memberId', new ValidateObjectId()) memberId: string): Promise<void> {
    await this.memberService.removeMember(memberId);
  }
}
