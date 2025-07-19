import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { Response } from 'express';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}


  @Post('send')
  async sendEmail(@Body() body: { to: string }) {
    return this.phishingService.sendTestEmail(body.to);
    //return this.phishingService.sendPhishingEmail(body.to, body.attemptId);
  }

  @Get('click/:id')
  async trackClick(@Param('id') id: string, @Res() res: Response) {
    await this.phishingService.markAsClicked(id);
    return res.send('<h1>You clicked a phishing link! This was a test.</h1>');
  }
  @Get('attempts')
    async getAllAttempts() {
    return this.phishingService.getAllAttempts();
   }
}