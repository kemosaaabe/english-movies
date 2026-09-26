import type { Response } from 'express';

import type { UserProfile } from '../../user/types';

export interface AuthResult {
  token: string;
  user: UserProfile;
}

export type AuthenticatedResponse = Response<unknown, { userId: string }>;
