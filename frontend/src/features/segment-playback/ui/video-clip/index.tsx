import { useRef } from 'react';

import { Typography, VideoControls } from '@shared/ui';

import { getPlaybackEndTime, getPlaybackStartTime } from '../../lib';
import { useSegmentPlayback } from '../../model';
import type { VideoClipProps } from '../../types';
import styles from './styles.modules.scss';

export const VideoClip = ({ clipNumber, currentSegment, videoUrl }: VideoClipProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startTime = getPlaybackStartTime(currentSegment.startTime);
  const endTime = getPlaybackEndTime(currentSegment.endTime, currentSegment.text);

  const {
    changeVolume,
    clipDuration,
    currentTime,
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
  } = useSegmentPlayback({
    endTime,
    startTime,
    videoRef,
  });

  return (
    <section className={styles.videoPanel}>
      <div className={styles.videoWrap}>
        <video
          className={styles.video}
          muted={isMuted}
          onClick={togglePlayback}
          onDurationChange={handleDurationChange}
          onLoadStart={handleLoadStart}
          onLoadedMetadata={handleLoadedMetadata}
          onPause={() => {
            setIsPlaying(false);
          }}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          ref={videoRef}
          src={videoUrl}
        />
        <Typography className={styles.videoBadge} variant="caption">
          <span className={styles.liveDot} /> Clip {clipNumber}
        </Typography>
        <VideoControls
          currentTime={currentTime}
          duration={clipDuration}
          isMuted={isMuted}
          isPlaying={isPlaying}
          onMuteToggle={toggleMute}
          onPlaybackToggle={togglePlayback}
          onReplay={replay}
          onSeek={seek}
          onVolumeChange={changeVolume}
          volume={volume}
        />
      </div>
    </section>
  );
};
