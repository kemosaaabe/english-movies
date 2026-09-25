import { Module } from '@nestjs/common';

import { DatabaseService } from './model/database.service';
import { LearnService } from './model/learn.service';
import { GuestGuard } from './model/guest.guard';
import { StudyService } from './model/study.service';
import { StudyController } from './study.controller';

@Module({
  controllers: [StudyController],
  providers: [DatabaseService, GuestGuard, StudyService, LearnService],
})
export class StudyModule {}
