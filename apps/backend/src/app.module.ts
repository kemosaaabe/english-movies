import { Module } from '@nestjs/common';
import { SubtitleModule } from './subtitle/subtitle.module';

@Module({
  imports: [SubtitleModule],
})
export class AppModule {}
