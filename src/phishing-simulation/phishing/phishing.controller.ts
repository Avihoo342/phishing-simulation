import { Controller, Post, Body, Get, Param, Res, Inject } from '@nestjs/common';
import { Response } from 'express';
import { IPhishingService } from '../phishing/interfaces/phishing.interface';

@Controller('phishing')
export class PhishingController {
  constructor(
    @Inject('IPhishingService') private readonly phishingService: IPhishingService,
  ) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; attemptId: string }) {
    return this.phishingService.sendPhishingEmail(body.to, body.attemptId);
  }

  @Get('click/:id')
  async trackClick(@Param('id') id: string, @Res() res: Response) {
    await this.phishingService.markAsClicked(id);
    return res.send('<h1>You clicked a phishing link! This was a test.</h1>');
  }

  @Get()
  async getAll() {
    return this.phishingService.getAllAttempts();
  }
}