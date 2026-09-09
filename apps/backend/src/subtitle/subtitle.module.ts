import { Module } from '@nestjs/common';
import { SubtitleService } from './model/subtitle.service';
import { SubtitleController } from './subtitle.controller';

@Module({
  controllers: [SubtitleController],
  providers: [SubtitleService],
})
export class SubtitleModule {}
