import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddMemberRequestDto, GetMembersRequestDto, UpdateMemberRequestDto } from './dtos/request.dto';
import { MemberResponseDto } from './dtos/response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from 'modules/shared/dtos/metadata-response.dto';
import { getPagination } from 'modules/shared/utils/get-pagination';
import { MemberModel } from 'modules/shared/models/member.model';
import { unlinkSync } from 'fs';
import moment from 'moment';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly configService: ConfigService,
  ) {}
  async addMember(addMemberDto: AddMemberRequestDto, avatar?: string): Promise<MemberResponseDto> {
    try {
      const { email, phone } = addMemberDto;
      const existedUser = await this.memberModel.model.findOne({
        $or: [{ phone }, { email }],
      });

      if (existedUser) {
        throw new BadRequestException('UserName, Email or phone number has been registered.');
      }

      if (addMemberDto.dateOfBirth) {
        const parsedDate = moment(addMemberDto.dateOfBirth, 'DD/MM/YYYY', true);
        if (!parsedDate.isValid()) {
          throw new BadRequestException('Invalid date format. Please use DD/MM/YYYY.');
        }
        addMemberDto.dateOfBirth = parsedDate.toDate();
      }

      const newUser = await this.memberModel.save({
        ...addMemberDto,
        avatar,
      });
      return plainToClass(MemberResponseDto, newUser.toObject());
    } catch (error) {
      if (avatar) {
        try {
          unlinkSync(`./images/${avatar}`);
        } catch (unlinkError) {
          console.error('Failed to delete avatar file:', unlinkError);
        }
      }
      throw new BadRequestException(`Error while add new member: ${error.message}`);
    }
  }

  async updateMember(
    memberId: string,
    updateMemberDto: UpdateMemberRequestDto,
    avatar?: string,
  ): Promise<MemberResponseDto> {
    const session = await this.memberModel.model.startSession();
    session.startTransaction();

    try {
      const existingMember = await this.memberModel.model.findById(memberId).session(session);

      if (!existingMember) {
        throw new BadRequestException('User not found');
      }
      if (updateMemberDto.dateOfBirth) {
        const parsedDate = moment(updateMemberDto.dateOfBirth, 'DD/MM/YYYY', true);
        if (!parsedDate.isValid()) {
          throw new BadRequestException('Invalid date format. Please use DD/MM/YYYY.');
        }
        updateMemberDto.dateOfBirth = parsedDate.toDate();
      }

      const updateData: any = { ...updateMemberDto };

      if (avatar) {
        try {
          unlinkSync(`./images/${avatar}`);
        } catch (unlinkError) {
          console.error('Failed to delete avatar file:', unlinkError);
        }
      }

      const updatedMember = await this.memberModel.model.findOneAndUpdate(
        { _id: memberId },
        { $set: updateData },
        { new: true },
      );

      await session.commitTransaction();
      session.endSession();

      return plainToClass(MemberResponseDto, updatedMember.toObject());
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (avatar) {
        try {
          unlinkSync(`./images/${avatar}`);
        } catch (unlinkError) {
          console.error('Failed to delete avatar file:', unlinkError);
        }
      }

      throw new BadRequestException(`Error while updating member: ${error.message}`);
    }
  }

  async getMember(memberId: string): Promise<MemberResponseDto> {
    try {
      const memberDoc = await this.memberModel.model.findById(memberId);
      if (!memberDoc) {
        throw new BadRequestException('Member  does not exist');
      }

      const memberObject = memberDoc.toObject();
      if (memberObject.avatar) {
        memberObject.avatar = `${this.configService.get('BASE_URL')}/images/${memberObject.avatar}`;
      }

      return plainToInstance(MemberResponseDto, memberObject);
    } catch (e) {
      throw new BadRequestException(`Error while get member details: ${e.message}`);
    }
  }

  async getMembers(): Promise<MemberResponseDto[]> {
    try {
      const membersDoc = await this.memberModel.model.find().exec();
      const members = membersDoc.map((doc) => {
        const memberObject = doc.toObject();
        if (memberObject.avatar) {
          memberObject.avatar = `${this.configService.get('BASE_URL')}/images/${memberObject.avatar}`;
        }
        return plainToInstance(MemberResponseDto, memberObject);
      });

      return members;
    } catch (e) {
      throw new BadRequestException(`Error while getting members: ${e.message}`);
    }
  }

  async getMembersBySearch(
    paginationDto: GetMembersRequestDto,
  ): Promise<ListRecordSuccessResponseDto<MemberResponseDto>> {
    try {
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
    } catch (e) {
      throw new BadRequestException(`Error while getting members by search: ${e.message}`);
    }
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
