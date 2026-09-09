import type { RefObject } from 'react';

export type UseSegmentPlaybackOptions = {
  endTime: number;
  startTime: number;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export type UseSegmentPlaybackResult = {
  handleTimeUpdate: () => void;
  replay: () => Promise<void>;
};
