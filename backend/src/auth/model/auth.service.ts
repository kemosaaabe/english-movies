import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../../user/model/users.service';

import { loginSchema, registrationSchema } from '../constants';
import { hashPassword, verifyPassword } from '../lib/password';
import { signToken } from '../lib/token';
import type { AuthResult } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(input: unknown): Promise<AuthResult> {
    const result = registrationSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.issues[0]?.message ?? 'Invalid registration details.');
    }

    const { email, name, password } = result.data;
    const passwordHash = await hashPassword(password);
    const user = await this.users.create(email, name, passwordHash);
    const token = signToken(user.id);

    return { token, user: this.users.toProfile(user) };
  }

  async login(input: unknown): Promise<AuthResult> {
    const result = loginSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.issues[0]?.message ?? 'Invalid sign-in details.');
    }

    const user = await this.users.findByEmail(result.data.email);

    if (!user || !(await verifyPassword(result.data.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = signToken(user.id);

    return { token, user: this.users.toProfile(user) };
  }
}
