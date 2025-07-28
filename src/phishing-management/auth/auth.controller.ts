import { Controller, Post, Body, Inject } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IAuthService } from './interfaces/auth-service.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject('IAuthService') private readonly authService: IAuthService) {}

  @Post('register')
  register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }
}