import { CreateAttemptDto } from '../dto/create-attempt.dto';
import { Attempt } from '../attempt.schema';

export interface ExpiredClickResponse {
  message: 'Link expired';
}

export type SimulationClickHtmlResponse = string;

export type UpdateClickResponse = ExpiredClickResponse | SimulationClickHtmlResponse;

export interface IAttemptsService {
  create(data: CreateAttemptDto): Promise<Attempt | null>;
  getAll(): Promise<Attempt[]>;
  updateClick(id: string): Promise<UpdateClickResponse | { message: string }>;
}