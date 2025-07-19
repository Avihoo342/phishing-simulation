import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhishingAttemptDocument = PhishingAttempt & Document;

@Schema({ timestamps: true })
export class PhishingAttempt {
  @Prop({ required: false })
  email: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  status: string;
}

export const PhishingAttemptSchema = SchemaFactory.createForClass(PhishingAttempt);