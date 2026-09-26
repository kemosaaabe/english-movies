import { Module } from '@nestjs/common';

import { AuthGuard } from '../auth/model/auth.guard';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';

import { LearnService } from './model/learn.service';
import { StudyService } from './model/study.service';
import { StudyController } from './study.controller';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StudyController],
  providers: [AuthGuard, StudyService, LearnService],
})
export class StudyModule {}
