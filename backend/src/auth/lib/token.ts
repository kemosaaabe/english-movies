import { sign, verify } from 'jsonwebtoken';

import { jwtAudience, jwtExpirationSeconds, jwtIssuer, jwtSecret } from '../constants';

export const signToken = (userId: string) => {
  return sign({ sub: userId }, jwtSecret, {
    algorithm: 'HS256',
    audience: jwtAudience,
    expiresIn: jwtExpirationSeconds,
    issuer: jwtIssuer,
  });
};

export const verifyToken = (token: string) => {
  const payload = verify(token, jwtSecret, {
    algorithms: ['HS256'],
    audience: jwtAudience,
    issuer: jwtIssuer,
  });

  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    throw new Error('Invalid token payload.');
  }

  return payload.sub;
};
