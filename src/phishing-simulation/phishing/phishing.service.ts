import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import validator from 'validator';
import { PhishingAttempt, PhishingAttemptDocument } from './schemas/phishing.schema';
import { IPhishingService } from '../phishing/interfaces/phishing.interface';

@Injectable()
export class PhishingService implements IPhishingService {
  constructor(
    @InjectModel(PhishingAttempt.name)
    private readonly model: Model<PhishingAttemptDocument>,
  ) {}

  async sendPhishingEmail(to: string, attemptId: string): Promise<{
    status: string;
    message: string;
    email: string;
    attemptId: string;
  }> {
    if (!to || !attemptId) {
      throw new BadRequestException('Missing email or attempt ID');
    }

    if (!validator.isEmail(to)) {
      throw new BadRequestException('Invalid email address');
    }

    const baseUrl = 'http://localhost:3001';
    const phishingLink = `${baseUrl}/attempts/${attemptId}`;
    const emailContent = this.createEmailContent(phishingLink);

    try {
      const transporter = this.getEmailTransporter();

      await transporter.sendMail({
        from: `"Phishing Simulation" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Important Account Notification',
        html: emailContent,
      });

      await this.model.findByIdAndUpdate(
        attemptId,
        { email: to, content: emailContent, clicked: false },
        { upsert: true, new: true },
      );

      return {
        status: 'success',
        message: 'Phishing email sent',
        email: to,
        attemptId,
      };
    } catch (error) {
      console.error('Error sending phishing email:', {
        message: error.message,
        attemptId,
        to,
      });
      throw new InternalServerErrorException('Failed to send phishing email');
    }
  }

  private getEmailTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private createEmailContent(link: string): string {
    return `
      <h2>Security Alert</h2>
      <p>Please verify your account immediately.</p>
      <a href="${link}">Click here to verify</a>
    `;
  }

  async markAsClicked(id: string): Promise<PhishingAttempt | null> {
    return this.model.findByIdAndUpdate(id, { clicked: true }, { new: true }).exec();
  }

  async getAllAttempts(): Promise<PhishingAttempt[]> {
    return this.model.find().exec();
  }
}