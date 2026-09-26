import { useCallback, useEffect, useRef, useState } from 'react';

import { initialVolume, maximumVolume, millisecondsPerSecond, minimumVolume } from '@shared/constants';

import type { UseSegmentPlaybackOptions } from '../../types';

export const useSegmentPlayback = ({ endTime, startTime, videoRef }: UseSegmentPlaybackOptions) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const lastAudibleVolumeRef = useRef(initialVolume);

  const startTimeInSeconds = startTime / millisecondsPerSecond;
  const requestedEndTimeInSeconds = endTime / millisecondsPerSecond;
  const playbackEndTime = mediaDuration
    ? Math.min(requestedEndTimeInSeconds, mediaDuration)
    : requestedEndTimeInSeconds;
  const clipDuration = Math.max(playbackEndTime - startTimeInSeconds, 0);
  const displayedCurrentTime = Math.min(currentTime, clipDuration);

  const replay = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startTimeInSeconds;
    setCurrentTime(0);
    video.play().catch(() => {
      video.pause();
    });
  }, [startTimeInSeconds, videoRef]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      if (video.currentTime >= playbackEndTime) {
        video.currentTime = startTimeInSeconds;
        setCurrentTime(0);
      }

      video.play().catch(() => {
        video.pause();
      });
      return;
    }

    video.pause();
  }, [playbackEndTime, startTimeInSeconds, videoRef]);

  const seek = useCallback(
    (nextTime: number) => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const clampedTime = Math.min(Math.max(nextTime, 0), clipDuration);

      video.currentTime = startTimeInSeconds + clampedTime;
      setCurrentTime(clampedTime);

      if (clampedTime >= clipDuration) {
        video.pause();
      }
    },
    [clipDuration, startTimeInSeconds, videoRef],
  );

  const changeVolume = useCallback(
    (nextVolume: number) => {
      const clampedVolume = Math.min(Math.max(nextVolume, minimumVolume), maximumVolume);
      const shouldMute = clampedVolume === minimumVolume;
      const video = videoRef.current;

      if (clampedVolume > minimumVolume) {
        lastAudibleVolumeRef.current = clampedVolume;
      }

      setVolume(clampedVolume);
      setIsMuted(shouldMute);

      if (video) {
        video.volume = clampedVolume;
        video.muted = shouldMute;
      }
    },
    [videoRef],
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (isMuted || volume === minimumVolume) {
      const restoredVolume = volume === minimumVolume ? lastAudibleVolumeRef.current : volume;

      setVolume(restoredVolume);
      setIsMuted(false);

      if (video) {
        video.volume = restoredVolume;
        video.muted = false;
      }

      return;
    }

    setIsMuted(true);

    if (video) {
      video.muted = true;
    }
  }, [isMuted, videoRef, volume]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setMediaDuration(Number.isFinite(video.duration) ? video.duration : 0);
    video.volume = volume;
    video.muted = isMuted;
  }, [isMuted, videoRef, volume]);

  const handleDurationChange = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setMediaDuration(Number.isFinite(video.duration) ? video.duration : 0);
  }, [videoRef]);

  const handleLoadStart = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setMediaDuration(0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const elapsedTime = Math.max(video.currentTime - startTimeInSeconds, 0);
    setCurrentTime(Math.min(elapsedTime, clipDuration));

    if (video.currentTime >= playbackEndTime) {
      video.pause();
    }
  }, [clipDuration, playbackEndTime, startTimeInSeconds, videoRef]);

  useEffect(() => {
    replay();
  }, [endTime, replay]);

  return {
    changeVolume,
    clipDuration,
    currentTime: displayedCurrentTime,
    handleDurationChange,
    handleLoadStart,
    handleLoadedMetadata,
    handleTimeUpdate,
    isMuted,
    isPlaying,
    replay,
    seek,
    setIsPlaying,
    toggleMute,
    togglePlayback,
    volume,
  };
};
