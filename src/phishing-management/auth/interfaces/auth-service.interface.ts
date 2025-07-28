import { User } from "src/phishing-management/users/users.schema";
import { RegisterAuthDto } from "../dto/register-auth.dto";
import { LoginAuthDto } from "../dto/login-auth.dto";

export interface IAuthService {
  register(body: RegisterAuthDto): Promise<User>;
  login(body: LoginAuthDto): Promise<{ access_token: string } | { message: string }>;
}