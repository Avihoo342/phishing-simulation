import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attempt extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'CLICKED';
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);