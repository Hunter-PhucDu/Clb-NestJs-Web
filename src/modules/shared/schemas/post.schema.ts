import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type PostDocument = Post & Document;

@Schema({
  collection: 'Posts',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  images?: string[];

  @Prop()
  videos?: string[];

  @Prop({ type: Object })
  richTextContent: any;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Boolean, default: false })
  published: boolean;

  @Prop({ type: String })
  comments?: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(mongoosePaginate);
