import { Module } from '@nestjs/common';

import { DatabaseService } from './model/database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
