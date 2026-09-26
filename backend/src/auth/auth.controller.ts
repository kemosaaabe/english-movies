import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { UsersService } from '../user/model/users.service';

import { jwtCookieName, sessionCookieOptions, sessionCookiePath } from './constants';
import { AuthGuard } from './model/auth.guard';
import { AuthService } from './model/auth.service';
import type { AuthenticatedResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post('register')
  async register(@Body() input: unknown, @Res({ passthrough: true }) response: Response) {
    const { token, user } = await this.auth.register(input);

    response.cookie(jwtCookieName, token, sessionCookieOptions);

    return user;
  }

  @Post('login')
  async login(@Body() input: unknown, @Res({ passthrough: true }) response: Response) {
    const { token, user } = await this.auth.login(input);

    response.cookie(jwtCookieName, token, sessionCookieOptions);

    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(jwtCookieName, { path: sessionCookiePath });

    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  profile(@Res({ passthrough: true }) response: AuthenticatedResponse) {
    return this.users.getProfile(response.locals.userId);
  }
}
