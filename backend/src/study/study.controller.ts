import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/model/auth.guard';
import type { AuthenticatedResponse } from '../auth/types';

import { LearnService } from './model/learn.service';
import { StudyService } from './model/study.service';
import type { CardInput, ModuleInput, SessionInput, StatusInput } from './types';

@Controller('study/modules')
@UseGuards(AuthGuard)
export class StudyController {
  constructor(
    private readonly study: StudyService,
    private readonly learn: LearnService,
  ) {}
  @Get()
  list(@Res({ passthrough: true }) response: AuthenticatedResponse) {
    return this.study.list(response.locals.userId);
  }
  @Post()
  create(@Res({ passthrough: true }) response: AuthenticatedResponse, @Body() input: ModuleInput) {
    return this.study.save(response.locals.userId, input);
  }
  @Get(':id')
  detail(@Res({ passthrough: true }) response: AuthenticatedResponse, @Param('id') id: string) {
    return this.study.detail(response.locals.userId, id);
  }
  @Patch(':id')
  update(
    @Res({ passthrough: true }) response: AuthenticatedResponse,
    @Param('id') id: string,
    @Body() input: ModuleInput,
  ) {
    return this.study.save(response.locals.userId, input, id);
  }
  @Delete(':id')
  remove(@Res({ passthrough: true }) response: AuthenticatedResponse, @Param('id') id: string) {
    return this.study.remove(response.locals.userId, id);
  }
  @Post(':id/cards')
  append(
    @Res({ passthrough: true }) response: AuthenticatedResponse,
    @Param('id') id: string,
    @Body() input: CardInput,
  ) {
    return this.study.append(response.locals.userId, id, input);
  }
  @Patch(':id/cards/:cardId/status')
  mark(
    @Res({ passthrough: true }) response: AuthenticatedResponse,
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Body() input: StatusInput,
  ) {
    return this.study.mark(response.locals.userId, id, cardId, input.status);
  }
  @Delete(':id/progress')
  reset(@Res({ passthrough: true }) response: AuthenticatedResponse, @Param('id') id: string) {
    return this.study.reset(response.locals.userId, id);
  }
  @Post(':id/session/:action')
  session(
    @Res({ passthrough: true }) response: AuthenticatedResponse,
    @Param('id') id: string,
    @Param('action') action: string,
    @Body() input: SessionInput,
  ) {
    return this.learn.session(response.locals.userId, id, action, input);
  }
}
