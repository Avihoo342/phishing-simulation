import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { Attempt } from './attempt.schema';
import { IAttemptsService } from '../attempts/interfaces/attempts.interface';
import { AttemptStatus } from './status.enum';

const simulationUrl = process.env.REACT_APP_SIMULATION_URL || 'http://localhost:3002';

@Injectable()
export class AttemptsService implements IAttemptsService {
  constructor(@InjectModel(Attempt.name) private model: Model<Attempt>) {}

  async create(data: CreateAttemptDto): Promise<Attempt | null> {
    const attempt = await this.model.create({ ...data, status: AttemptStatus.PENDING });
    try {
      await axios.post(`${simulationUrl}/phishing/send`, {
        attemptId: attempt._id,
        to: data.email,
      });
      await this.model.findByIdAndUpdate(attempt._id, { status: AttemptStatus.SENT });
    } catch (error) {
      console.error('Failed to send phishing email:', error.message);
      await this.model.findByIdAndUpdate(attempt._id, { status: AttemptStatus.FAILED });
    }
    return await this.model.findById(attempt._id);
  }

  async getAll(): Promise<Attempt[]> {
    return this.model.find();
  }

async updateClick(id: string): Promise<any> {
  const attempt = await this.model.findById(id);
  if (!attempt) {
    throw new Error('Attempt not found');
  }

  const now = new Date();
  const diff = now.getTime() - attempt.createdAt.getTime();

  if (diff > 60 * 1000) {
    if (attempt.status !== AttemptStatus.EXPIRED) {
      await this.model.findByIdAndUpdate(id, { status: AttemptStatus.EXPIRED });
    }
    return { message: 'Link expired' };
  }

  await this.model.findByIdAndUpdate(id, { status: AttemptStatus.CLICKED }, { new: true });
  const response = await axios.get(`${simulationUrl}/phishing/click/${id}`);
  return response.data;
}
}