import type { SubtitleSegment } from '@entities/subtitle-segment';
import { millisecondsPerSecond } from '@shared/constants';

export const trimSubtitleSegments = (
  segments: SubtitleSegment[],
  startTime: number,
  endTime: number,
): SubtitleSegment[] => {
  const startTimeInMilliseconds = startTime * millisecondsPerSecond;
  const endTimeInMilliseconds = endTime * millisecondsPerSecond;

  return segments
    .filter(
      (segment) => segment.startTime >= startTimeInMilliseconds && segment.endTime <= endTimeInMilliseconds,
    )
    .map((segment) => ({
      ...segment,
      endTime: segment.endTime - startTimeInMilliseconds,
      startTime: segment.startTime - startTimeInMilliseconds,
    }));
};
