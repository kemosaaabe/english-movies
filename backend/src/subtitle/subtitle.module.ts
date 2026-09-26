import { Module } from '@nestjs/common';

import { AuthGuard } from '../auth/model/auth.guard';
import { UserModule } from '../user/user.module';

import { SubtitleService } from './model/subtitle.service';
import { SubtitleController } from './subtitle.controller';

@Module({
  imports: [UserModule],
  controllers: [SubtitleController],
  providers: [AuthGuard, SubtitleService],
})
export class SubtitleModule {}
