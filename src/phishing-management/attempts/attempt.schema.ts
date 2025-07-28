import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AttemptStatus } from './status.enum';

@Schema()
export class Attempt extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ type: String, enum: AttemptStatus, default: AttemptStatus.PENDING })
  status: AttemptStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);