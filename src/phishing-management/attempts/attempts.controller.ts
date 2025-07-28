import { Controller, Post, Body, Get, UseGuards, Param, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { IAttemptsService } from './interfaces/attempts.interface';

@Controller('attempts')
export class AttemptsController {
  constructor(@Inject('IAttemptsService') private service: IAttemptsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateAttemptDto) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.service.getAll();
  }
  
  @Get(':id')
  getClicked(@Param('id') id: string) {
    return this.service.updateClick(id);
  }
}