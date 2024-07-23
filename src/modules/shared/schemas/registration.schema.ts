import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ESex } from '../enums/sex.enum';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Question } from './Question.schema';
import { Types } from 'mongoose';

export type RegistrationDocument = Registration & Document;

@Schema({
  collection: 'Registrations',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Registration {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  class: string;

  @Prop({ required: false, unique: false })
  phone?: string;

  @Prop({ type: String, required: true, unique: false })
  email: string;

  @Prop({ type: String, required: false, enum: ESex, default: ESex.MALE })
  sex?: ESex;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: Question.name }], default: [] })
  questions?: Question[];

  @Prop({ type: Boolean, required: true, default: false })
  passedFirstRound: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  passedSecondRound: boolean;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
RegistrationSchema.plugin(mongoosePaginate);
