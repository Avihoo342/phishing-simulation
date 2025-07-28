import { CreateAttemptDto } from '../dto/create-attempt.dto';
import { Attempt } from '../attempt.schema';

export interface IAttemptsService {
  create(data: CreateAttemptDto): Promise<Attempt | null>;
  getAll(): Promise<Attempt[]>;
  updateClick(id: string): Promise<any>;
}