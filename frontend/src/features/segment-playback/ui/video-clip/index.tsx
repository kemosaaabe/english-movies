import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

import { Typography } from '@shared/ui';

import { getPlaybackEndTime, getPlaybackStartTime } from '../../lib';
import { useSegmentPlayback } from '../../model';
import type { VideoClipProps } from '../../types';
import styles from './styles.modules.scss';

export const VideoClip = ({ clipNumber, currentSegment, videoUrl }: VideoClipProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const startTime = getPlaybackStartTime(currentSegment.startTime);
  const endTime = getPlaybackEndTime(currentSegment.endTime, currentSegment.text);

  const {
    clipDuration,
    currentTime,
    handleTimeUpdate,
    isPlaying,
    progress,
    replay,
    setIsPlaying,
    togglePlayback,
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
        {!isPlaying && (
          <button className={styles.videoCenterControl} onClick={togglePlayback} type="button">
            <Play fill="currentColor" size={25} />
            <span>Play clip</span>
          </button>
        )}
        <div className={styles.videoShade} />
        <div className={styles.videoControlShelf}>
          <div className={styles.videoProgress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.videoToolbar}>
            <div className={styles.videoActions}>
              <button onClick={togglePlayback} type="button">
                {isPlaying ? <Pause fill="currentColor" size={15} /> : <Play fill="currentColor" size={15} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button onClick={replay} type="button">
                <RotateCcw size={15} />
                <span>Replay</span>
              </button>
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                }}
                type="button"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isMuted ? 'Sound on' : 'Mute'}</span>
              </button>
            </div>
            <Typography className={styles.clipTime} variant="caption">
              {currentTime.toFixed(1)} / {clipDuration.toFixed(1)} sec
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};
