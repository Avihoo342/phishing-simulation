import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attempts')
export class AttemptsController {
  constructor(private service: AttemptsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
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