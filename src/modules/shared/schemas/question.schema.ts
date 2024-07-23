import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type QuestionDocument = Question & Document;

@Schema({
  collection: 'Questions',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Question {
  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: String, required: false })
  answer?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.plugin(mongoosePaginate);
