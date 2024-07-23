import { BadRequestException, Injectable } from '@nestjs/common';
import { AddMemberRequestDto, GetMembersRequestDto, UpdateMemberRequestDto } from './dtos/request.dto';
import { MemberResponseDto } from './dtos/response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from 'modules/shared/dtos/metadata-response.dto';
import { getPagination } from 'modules/shared/utils/get-pagination';
import { MemberModel } from 'modules/shared/models/member.model';

@Injectable()
export class MemberService {
  constructor(private readonly memberModel: MemberModel) {}
  async addMember(addMemberDto: AddMemberRequestDto, avatar?: string): Promise<MemberResponseDto> {
    try {
      const { email, phone } = addMemberDto;
      const existedUser = await this.memberModel.model.findOne({
        $or: [{ phone }, { email }],
      });

      if (existedUser) {
        throw new BadRequestException('UserName, Email or phone number has been registered.');
      }

      const newUser = await this.memberModel.save({
        ...addMemberDto,
        avatar,
      });
      return plainToClass(MemberResponseDto, newUser.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while add new member: ${error.message}`);
    }
  }

  async updateMember(
    memberId: string,
    updateMemberDto: UpdateMemberRequestDto,
    avatar?: string,
  ): Promise<MemberResponseDto> {
    try {
      const updateData: any = { ...updateMemberDto };
      if (avatar) {
        updateData.avatar = avatar;
      }

      const updatedMember = await this.memberModel.model.findOneAndUpdate(
        { _id: memberId },
        { $set: updateData },
        { new: true },
      );

      if (!updatedMember) {
        throw new BadRequestException('User not found');
      }

      return plainToClass(MemberResponseDto, updatedMember.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating member: ${error.message}`);
    }
  }

  async getMember(memberId: string): Promise<MemberResponseDto> {
    try {
      const memberDoc = await this.memberModel.model.findById(memberId);
      if (!memberDoc) {
        throw new BadRequestException('Member  does not exist');
      }
      return plainToInstance(MemberResponseDto, memberDoc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while get member details: ${e.message}`);
    }
  }

  async getMembers(): Promise<MemberResponseDto[]> {
    try {
      const membersDoc = await this.memberModel.model.find().exec();
      return membersDoc.map((doc) => doc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while getting members: ${e.message}`);
    }
  }

  async getMembersBySearch(
    paginationDto: GetMembersRequestDto,
  ): Promise<ListRecordSuccessResponseDto<MemberResponseDto>> {
    const { page, size, search } = paginationDto;
    const skip = (page - 1) * size;

    const searchCondition = search ? { fullName: { $regex: new RegExp(search, 'i') } } : {};

    const [members, totalItem] = await Promise.all([
      this.memberModel.model.find(searchCondition).skip(skip).limit(size).exec(),
      this.memberModel.model.countDocuments(searchCondition),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const memberResponseDtos: MemberResponseDto[] = plainToInstance(MemberResponseDto, members);

    return {
      metadata,
      data: memberResponseDtos,
    };
  }

  async removeMember(memberId: string): Promise<void> {
    try {
      const Doc = await this.memberModel.model.findById(memberId);
      if (!Doc) throw new BadRequestException('Member  does not exist');
      await this.memberModel.model.findByIdAndRemove(memberId);
    } catch (e) {
      throw new BadRequestException(`Error while deleting member : ${e.message}`);
    }
  }
}
