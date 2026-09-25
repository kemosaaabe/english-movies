import { useCallback, useEffect, useState } from 'react';

import { millisecondsPerSecond } from '@shared/constants';

import type { UseSegmentPlaybackOptions } from '../../types';

export const useSegmentPlayback = ({ endTime, startTime, videoRef }: UseSegmentPlaybackOptions) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const clipDuration = (endTime - startTime) / millisecondsPerSecond;

  const replay = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startTime / millisecondsPerSecond;
    setCurrentTime(0);
    video.play().catch(() => {
      video.pause();
    });
  }, [startTime, videoRef]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      if (video.currentTime >= endTime / millisecondsPerSecond) {
        video.currentTime = startTime / millisecondsPerSecond;
        setCurrentTime(0);
      }

      video.play().catch(() => {
        video.pause();
      });
      return;
    }

    video.pause();
  }, [endTime, startTime, videoRef]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const elapsedTime = Math.max(video.currentTime - startTime / millisecondsPerSecond, 0);
    setCurrentTime(Math.min(elapsedTime, clipDuration));

    if (video.currentTime >= endTime / millisecondsPerSecond) {
      video.pause();
    }
  }, [clipDuration, endTime, startTime, videoRef]);

  useEffect(() => {
    replay();
  }, [replay]);

  const progress = clipDuration > 0 ? (currentTime / clipDuration) * 100 : 0;

  return {
    clipDuration,
    currentTime,
    handleTimeUpdate,
    isPlaying,
    progress,
    replay,
    setIsPlaying,
    togglePlayback,
  };
};
