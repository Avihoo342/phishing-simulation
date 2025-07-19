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
async sendTestEmail(to: string) {
  const attempt = await this.model.create({
    email: to,
    clicked: false,
  });

  const attemptId = attempt._id.toString();

  const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });

  const phishingLink = `http://localhost:3002/phishing/click/${attemptId}`;
  const emailContent = `
    <h2>Security Alert</h2>
    <p>Please verify your account immediately.</p>
    <a href="${phishingLink}">Click here to verify</a>
  `;

  const info = await transporter.sendMail({
    from: '"Phishing Sim" <no-reply@phishsim.com>',
    to,
    subject: 'Test Phishing Email',
    html: emailContent,
    text: 'This is a fake phishing email for test.',
  });

  await this.model.findByIdAndUpdate(
    attempt._id,
    {
      email: to,
      clicked: false,
      content: emailContent,
      status: 'sent',
      updatedAt: new Date(),
    },
    { new: true }
  );
  console.log('Preview Email Content:\n', info.message.toString());
}

  async sendPhishingEmail(to: string) {
    const attemptId = to
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