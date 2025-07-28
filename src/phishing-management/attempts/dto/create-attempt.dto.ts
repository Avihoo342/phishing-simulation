import { IsEmail } from 'class-validator';

export class CreateAttemptDto {
  @IsEmail()
  email: string;
}