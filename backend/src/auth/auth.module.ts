import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { jwtSecret } from './constants';
import { AuthController } from './auth.controller';
import { AuthGuard } from './model/auth.guard';
import { AuthService } from './model/auth.service';

if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters.');
}

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard],
})
export class AuthModule {}
