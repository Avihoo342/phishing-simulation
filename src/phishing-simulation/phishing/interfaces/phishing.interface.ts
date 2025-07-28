import { PhishingAttempt } from "../schemas/phishing.schema";

export interface IPhishingService {
  sendPhishingEmail(to: string, attemptId: string): Promise<{
    status: string;
    message: string;
    email: string;
    attemptId: string;
  }>;
  markAsClicked(id: string): Promise<PhishingAttempt | null>;
  getAllAttempts(): Promise<PhishingAttempt[]>;
}