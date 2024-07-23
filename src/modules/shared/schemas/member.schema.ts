import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ESex } from '../enums/sex.enum';
import { ECommittee } from '../enums/committee.enum';

export type MemberDocument = Member & Document;

@Schema({
  collection: 'Members',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Member {
  @Prop({ required: false, type: String })
  avatar?: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  class: string;

  @Prop({ required: false, unique: true })
  phone: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false, enum: ESex, default: ESex.MALE })
  sex: ESex;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: Date, required: true })
  joinedDate: Date;

  @Prop({ required: false, enum: ECommittee })
  committee?: ECommittee;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.plugin(mongoosePaginate);
