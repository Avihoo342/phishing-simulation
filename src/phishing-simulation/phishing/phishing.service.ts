import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PhishingAttempt } from './schemas/phishing.schema';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';

@Injectable()
export class PhishingService {
  constructor(
    @InjectModel(PhishingAttempt.name)
    private readonly model: Model<PhishingAttempt>,
  ) {}

  async sendPhishingEmail(to: string, attemptId: string) {
    const phishingLink = `http://localhost:3001/attempts/${attemptId}`;

    const emailContent = `
      <h2>Security Alert</h2>
      <p>Please verify your account immediately.</p>
      <a href="${phishingLink}">Click here to verify</a>
    `;

    await this.model.findByIdAndUpdate(
      attemptId,
      { email: to, content: emailContent, clicked: false },
      { upsert: true, new: true },
    );
    try{
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
   });

    await transporter.sendMail({
      from: `"Phishing Simulation" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Important Account Notification',
      html: emailContent,
    });
  } catch(error) {
    console.error('Error sending phishing email:', error);
  }

    return { message: 'Phishing email sent' };
  }

  async markAsClicked(id: string) {
    return this.model.findByIdAndUpdate(id, { clicked: true });
  }

  async getAllAttempts() {
  return this.model.find().exec();
  }
}