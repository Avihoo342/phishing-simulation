import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhishingAttemptDocument = PhishingAttempt & Document;

@Schema({ timestamps: true })
export class PhishingAttempt {
  @Prop({ required: true })
  email: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  clicked: boolean;
}

export const PhishingAttemptSchema = SchemaFactory.createForClass(PhishingAttempt);