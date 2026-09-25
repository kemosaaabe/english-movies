import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';

import { GuestGuard } from './model/guest.guard';
import { LearnService } from './model/learn.service';
import { StudyService } from './model/study.service';
import type { CardInput, GuestResponse, ModuleInput, SessionInput, StatusInput } from './types';

@Controller('study/modules')
@UseGuards(GuestGuard)
export class StudyController {
  constructor(
    private readonly study: StudyService,
    private readonly learn: LearnService,
  ) {}
  @Get()
  list(@Res({ passthrough: true }) response: GuestResponse) {
    return this.study.list(response.locals.studyOwner);
  }
  @Post()
  create(@Res({ passthrough: true }) response: GuestResponse, @Body() input: ModuleInput) {
    return this.study.save(response.locals.studyOwner, input);
  }
  @Get(':id')
  detail(@Res({ passthrough: true }) response: GuestResponse, @Param('id') id: string) {
    return this.study.detail(response.locals.studyOwner, id);
  }
  @Patch(':id')
  update(
    @Res({ passthrough: true }) response: GuestResponse,
    @Param('id') id: string,
    @Body() input: ModuleInput,
  ) {
    return this.study.save(response.locals.studyOwner, input, id);
  }
  @Delete(':id')
  remove(@Res({ passthrough: true }) response: GuestResponse, @Param('id') id: string) {
    return this.study.remove(response.locals.studyOwner, id);
  }
  @Post(':id/cards')
  append(
    @Res({ passthrough: true }) response: GuestResponse,
    @Param('id') id: string,
    @Body() input: CardInput,
  ) {
    return this.study.append(response.locals.studyOwner, id, input);
  }
  @Patch(':id/cards/:cardId/status')
  mark(
    @Res({ passthrough: true }) response: GuestResponse,
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Body() input: StatusInput,
  ) {
    return this.study.mark(response.locals.studyOwner, id, cardId, input.status);
  }
  @Delete(':id/progress')
  reset(@Res({ passthrough: true }) response: GuestResponse, @Param('id') id: string) {
    return this.study.reset(response.locals.studyOwner, id);
  }
  @Post(':id/session/:action')
  session(
    @Res({ passthrough: true }) response: GuestResponse,
    @Param('id') id: string,
    @Param('action') action: string,
    @Body() input: SessionInput,
  ) {
    return this.learn.session(response.locals.studyOwner, id, action, input);
  }
}
