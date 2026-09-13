import { secondsPerMinute } from '@shared/constants';

export const formatTrimTime = (time: number): string => {
  const totalSeconds = Math.round(time);
  const hours = Math.floor(totalSeconds / secondsPerMinute ** 2);
  const minutes = Math.floor(totalSeconds / secondsPerMinute) % secondsPerMinute;
  const seconds = totalSeconds % secondsPerMinute;
  const formattedSeconds = seconds.toString().padStart(2, '0');

  if (hours === 0) {
    return `${minutes}:${formattedSeconds}`;
  }

  return `${hours}:${minutes.toString().padStart(2, '0')}:${formattedSeconds}`;
};
