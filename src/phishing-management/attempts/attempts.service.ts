import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attempt } from './attempt.schema';
import { Model } from 'mongoose';
import axios from 'axios';

@Injectable()
export class AttemptsService {
  constructor(@InjectModel(Attempt.name) private model: Model<Attempt>) {}

  async create(data: any) {
    const attempt = await this.model.create({ ...data, status: 'PENDING' });
    await axios.post('http://localhost:3002/phishing/send', {
      attemptId: attempt._id,
      to: data.email,
    });

    return attempt;
  }

  async getAll() {
    return this.model.find();
  }
}