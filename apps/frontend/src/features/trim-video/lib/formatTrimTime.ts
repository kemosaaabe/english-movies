import { secondsPerMinute } from '@shared/constants';

export const formatTrimTime = (time: number): string => {
  const minutes = Math.floor(time / secondsPerMinute);
  const seconds = time - minutes * secondsPerMinute;

  return `${minutes}:${seconds.toFixed(0).padStart(2, '0')}`;
};
