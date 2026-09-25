import { randomBytes } from 'node:crypto';

import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { guestCookieMaxAge, guestCookieName } from '../constants';
import type { GuestResponse } from '../types';
import { DatabaseService } from './database.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private readonly database: DatabaseService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<GuestResponse>();
    const cookie = request.headers.cookie
      ?.split(';')
      .map((part) => {
        return part.trim();
      })
      .find((part) => {
        return part.startsWith(`${guestCookieName}=`);
      })
      ?.slice(guestCookieName.length + 1);
    if (cookie) {
      const result = await this.database.pool.query<{ id: string }>(
        'SELECT id FROM study_owners WHERE id=$1',
        [cookie],
      );
      if (result.rows[0]) {
        response.locals.studyOwner = result.rows[0].id;

        return true;
      }
    }
    const owner = randomBytes(32).toString('hex');
    await this.database.pool.query('INSERT INTO study_owners(id) VALUES($1)', [owner]);
    response.cookie(guestCookieName, owner, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: guestCookieMaxAge,
    });
    response.locals.studyOwner = owner;

    return true;
  }
}
