import { useCallback, useEffect } from 'react';
import { millisecondsPerSecond, playbackEndTolerance } from '../../constants';
import type { UseSegmentPlaybackOptions, UseSegmentPlaybackResult } from '../types';

export const useSegmentPlayback = ({ endTime, startTime, videoRef }: UseSegmentPlaybackOptions): UseSegmentPlaybackResult => {
  const replay = useCallback(async (): Promise<void> => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startTime / millisecondsPerSecond;

    try {
      await video.play();
    } catch {
      video.pause();
    }
  }, [startTime, videoRef]);

  const handleTimeUpdate = useCallback((): void => {
    const video = videoRef.current;

    if (video && video.currentTime >= endTime / millisecondsPerSecond - playbackEndTolerance) {
      video.pause();
    }
  }, [endTime, videoRef]);

  useEffect(() => {
    void replay();
  }, [replay]);

  return { handleTimeUpdate, replay };
};
