import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/model/auth.guard';

import { missingSubtitleMessage, subtitleFileField } from './constants';
import { SubtitleService } from './model/subtitle.service';
import type { SubtitleSegment } from './types';

@Controller('subtitles')
@UseGuards(AuthGuard)
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
