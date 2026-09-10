import { nonWordCharacterPattern } from '@shared/constants';

export const normalizeWord = (value: string) =>
  value.trim().toLocaleLowerCase().replace(nonWordCharacterPattern, '');

export const sanitizeWord = (value: string) => value.replace(nonWordCharacterPattern, '');
