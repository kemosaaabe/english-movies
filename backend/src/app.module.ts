import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { StudyModule } from './study/study.module';
import { SubtitleModule } from './subtitle/subtitle.module';

@Module({
  imports: [AuthModule, SubtitleModule, StudyModule],
})
export class AppModule {}
