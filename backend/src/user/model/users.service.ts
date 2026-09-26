import { randomUUID } from 'node:crypto';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { DatabaseService } from '../../database/model/database.service';

import type { UserProfile, UserRow } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(email: string, name: string, passwordHash: string) {
    const result = await this.database.pool.query<UserRow>(
      'INSERT INTO users(id,email,name,password_hash) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING RETURNING id,email,name,password_hash,created_at',
      [randomUUID(), email, name, passwordHash],
    );
    const user = result.rows[0];

    if (!user) {
      throw new ConflictException('An account with this email already exists.');
    }

    return user;
  }

  async findByEmail(email: string) {
    const result = await this.database.pool.query<UserRow>(
      'SELECT id,email,name,password_hash,created_at FROM users WHERE email=$1',
      [email],
    );

    return result.rows[0];
  }

  async findById(id: string) {
    const result = await this.database.pool.query<UserRow>(
      'SELECT id,email,name,password_hash,created_at FROM users WHERE id=$1',
      [id],
    );

    return result.rows[0];
  }

  async getProfile(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.toProfile(user);
  }

  toProfile(user: UserRow): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at.toISOString(),
    };
  }
}
