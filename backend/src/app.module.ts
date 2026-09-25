import { Module } from '@nestjs/common';
import { StudyModule } from './study/study.module';
import { SubtitleModule } from './subtitle/subtitle.module';

@Module({
  imports: [SubtitleModule, StudyModule],
})
export class AppModule {}
