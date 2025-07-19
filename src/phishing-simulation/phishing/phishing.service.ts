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

  //i used this method to check the send mail works
  async sendTestEmail(to: string, attemptId: string) {
    const testAccount = await nodemailer.createTestAccount();

   const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });

    const info = await transporter.sendMail({
      from: '"Phishing Sim" <no-reply@phishsim.com>',
      to: 'test@example.com',
      subject: 'Test Phishing Email',
      text: 'This is a fake phishing email for test.',
      html: '<b>This is a fake phishing email for test.</b>',
    });
    const phishingLink = `http://localhost:3002/phishing/click/${attemptId}`;
    const emailContent = `
      <h2>Security Alert</h2>
      <p>Please verify your account immediately.</p>
      <a href="${phishingLink}">Click here to verify</a>
    `;
    await this.model.findByIdAndUpdate(
    attemptId,
    {
      email: to,
      content: emailContent,
      status: 'sent',
      updatedAt: new Date(),
    },
    { upsert: false, new: true },
  );
    console.log('Preview URL:', info.message.toString());
  }

  async sendPhishingEmail(to: string, attemptId: string) {
    const phishingLink = `http://localhost:3002/phishing/click/${attemptId}`;

    const emailContent = `
      <h2>Security Alert</h2>
      <p>Please verify your account immediately.</p>
      <a href="${phishingLink}">Click here to verify</a>
    `;

    await this.model.findByIdAndUpdate(
      attemptId,
      { email: to, content: emailContent },
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
    //falling to example to not fail the server
    await this.model.findByIdAndUpdate(
      attemptId,
      { email: to, content: emailContent },
      { upsert: true, new: true },
    );
    this.sendTestEmail(to, emailContent)
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