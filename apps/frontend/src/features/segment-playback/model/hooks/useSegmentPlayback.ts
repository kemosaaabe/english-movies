import { useCallback, useEffect } from 'react';

import { millisecondsPerSecond } from '../../constants';
import type { UseSegmentPlaybackOptions } from '../../types';

export const useSegmentPlayback = ({ endTime, startTime, videoRef }: UseSegmentPlaybackOptions) => {
  const replay = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startTime / millisecondsPerSecond;
    video.play().catch(() => video.pause());
  }, [startTime, videoRef]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (video && video.currentTime >= endTime / millisecondsPerSecond) {
      video.pause();
    }
  }, [endTime, videoRef]);

  useEffect(() => {
    replay();
  }, [replay]);

  return { handleTimeUpdate, replay };
};
