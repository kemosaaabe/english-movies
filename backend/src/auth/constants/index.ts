import type { CookieOptions } from 'express';
import { z } from 'zod';

export const jwtCookieName = 'reellingo_session';
export const jwtExpirationSeconds = 7 * 24 * 60 * 60;
export const jwtCookieMaxAge = jwtExpirationSeconds * 1000;
export const jwtIssuer = 'reellingo';
export const jwtAudience = 'reellingo-app';
export const jwtSecret = process.env.JWT_SECRET ?? '';
export const cookieSecure = process.env.COOKIE_SECURE === 'true';
export const sessionCookiePath = '/';
export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: cookieSecure,
  maxAge: jwtCookieMaxAge,
  path: sessionCookiePath,
};
export const passwordSaltBytes = 16;
export const passwordKeyBytes = 64;
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

export const registrationSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
