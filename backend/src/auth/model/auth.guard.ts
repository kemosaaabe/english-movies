import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { UsersService } from '../../user/model/users.service';

import { jwtCookieName } from '../constants';
import { verifyToken } from '../lib/token';
import type { AuthenticatedResponse } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly users: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<AuthenticatedResponse>();
    const cookie = request.headers.cookie
      ?.split(';')
      .map((part) => {
        return part.trim();
      })
      .find((part) => {
        return part.startsWith(`${jwtCookieName}=`);
      })
      ?.slice(jwtCookieName.length + 1);
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : cookie;

    if (!token) {
      throw new UnauthorizedException();
    }

    let userId: string;

    try {
      userId = verifyToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.users.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    response.locals.userId = user.id;

    return true;
  }
}
