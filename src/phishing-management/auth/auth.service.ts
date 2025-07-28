import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IUsersService } from '../users/interfaces/users-service.interface';
import { IAuthService } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject('IUsersService') private readonly usersService: IUsersService, private jwtService: JwtService) {}

  async register(data: RegisterAuthDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({ ...data, password: hashedPassword });
    return user;
  }

  async login(data: LoginAuthDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return { message: 'Invalid credentials' };
    }

    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}