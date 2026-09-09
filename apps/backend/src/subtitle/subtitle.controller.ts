import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { missingSubtitleMessage, subtitleFileField } from './constants';
import { SubtitleService } from './model/subtitle.service';
import { SubtitleSegment } from './types';

@Controller('subtitles')
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) {}

  @Post('parse')
  @UseInterceptors(FileInterceptor(subtitleFileField))
  parse(@UploadedFile() file?: Express.Multer.File): SubtitleSegment[] {
    if (!file) {
      throw new BadRequestException(missingSubtitleMessage);
    }

    return this.subtitleService.parse(file.buffer.toString('utf-8'));
  }
}
