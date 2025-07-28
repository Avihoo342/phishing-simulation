import { Module } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PhishingController } from './phishing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingAttempt, PhishingAttemptSchema } from './schemas/phishing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingAttempt.name, schema: PhishingAttemptSchema },
    ]),
  ],
  controllers: [PhishingController],
  providers: [
    {
      provide: 'IPhishingService',
      useClass: PhishingService,
    },
  ],
})
export class PhishingModule {}