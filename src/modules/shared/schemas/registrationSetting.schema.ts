import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type RegistrationSettingDocument = RegistrationSetting & Document;

@Schema({
  collection: 'RegistrationSetting',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class RegistrationSetting {
  @Prop({ type: Boolean, required: true })
  isRegistrationOpen: boolean;
}

export const RegistrationSettingSchema = SchemaFactory.createForClass(RegistrationSetting);
RegistrationSettingSchema.plugin(mongoosePaginate);
