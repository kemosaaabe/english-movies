import type { RefObject } from 'react';

import type { SubtitleSegment } from '@entities/subtitle-segment';

export type UseSegmentPlaybackOptions = {
  endTime: number;
  startTime: number;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export type VideoClipProps = {
  clipNumber: number;
  currentSegment: SubtitleSegment;
  videoUrl: string;
};
