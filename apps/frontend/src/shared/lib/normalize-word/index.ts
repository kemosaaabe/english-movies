import { nonWordCharacterPattern } from './constants';

export const normalizeWord = (value: string): string =>
  value.trim().toLocaleLowerCase().replace(nonWordCharacterPattern, '');

export const sanitizeWord = (value: string): string => value.replace(nonWordCharacterPattern, '');
