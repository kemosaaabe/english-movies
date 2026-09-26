import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

import { passwordKeyBytes, passwordSaltBytes } from '../constants';

const derivePasswordKey = (password: string, salt: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, passwordKeyBytes, (error, key) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(key);
    });
  });
};

export const hashPassword = async (password: string) => {
  const salt = randomBytes(passwordSaltBytes).toString('hex');
  const key = await derivePasswordKey(password, salt);

  return `${salt}:${key.toString('hex')}`;
};

export const verifyPassword = async (password: string, passwordHash: string) => {
  const [salt, storedKey] = passwordHash.split(':');
  const key = await derivePasswordKey(password, salt);
  const expectedKey = Buffer.from(storedKey, 'hex');

  return expectedKey.length === key.length && timingSafeEqual(expectedKey, key);
};
