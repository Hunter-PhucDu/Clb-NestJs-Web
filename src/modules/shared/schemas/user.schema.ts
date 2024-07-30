import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ERole } from '../enums/auth.enum';
import { ESex } from '../enums/sex.enum';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ERank } from '../enums/rank.enum';

export type UserDocument = User & Document;

@Schema({
  collection: 'Users',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User {
  @Prop({ required: false, type: String })
  avatar?: string;

  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ required: false, unique: true })
  phone?: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false, enum: ESex, default: ESex.MALE })
  sex?: ESex;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: true, default: 0 })
  experiencePoints?: number;

  @Prop({ type: String, enum: ERank, default: ERank.IRON })
  rank: ERank;

  @Prop({ type: String, required: true, enum: ERole })
  role: ERole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
UserSchema.index({ userName: 1 });
UserSchema.index({ email: 1 });
