import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useId } from 'react';

import {
  maximumVolume,
  mediaTimelineStep,
  minimumVolume,
  secondsPerMinute,
  volumePercentageMultiplier,
  volumeStep,
} from '@shared/constants';

import { Typography } from '../typography';
import styles from './styles.modules.scss';

const formatPlaybackTime = (time: number) => {
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

interface VideoControlsProps {
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isPlaying: boolean;
  onMuteToggle: () => void;
  onPlaybackToggle: () => void;
  onReplay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
}

export const VideoControls = ({
  currentTime,
  duration,
  isMuted,
  isPlaying,
  onMuteToggle,
  onPlaybackToggle,
  onReplay,
  onSeek,
  onVolumeChange,
  volume,
}: VideoControlsProps) => {
  const timelineInputId = useId();
  const volumeInputId = useId();
  const displayedVolume = isMuted ? minimumVolume : volume;
  const displayedVolumePercentage = Math.round(displayedVolume * volumePercentageMultiplier);
  const playbackProgress = duration > 0 ? (currentTime / duration) * volumePercentageMultiplier : 0;

  return (
    <div className={styles.controls}>
      <div className={styles.timeline}>
        <div className={styles.timelineHeader}>
          <Typography className={styles.time} variant="caption">
            {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
          </Typography>
        </div>
        <div className={styles.timelineTrack}>
          <span className={styles.timelineProgress} style={{ width: `${playbackProgress}%` }} />
          <input
            aria-valuetext={`${currentTime.toFixed(1)} seconds of ${duration.toFixed(1)} seconds`}
            className={styles.timelineRange}
            disabled={duration <= 0}
            id={timelineInputId}
            max={duration}
            min={0}
            onChange={(event) => {
              onSeek(Number(event.target.value));
            }}
            step={mediaTimelineStep}
            type="range"
            value={currentTime}
          />
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          <button onClick={onPlaybackToggle} type="button">
            {isPlaying ? <Pause fill="currentColor" size={15} /> : <Play fill="currentColor" size={15} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button onClick={onReplay} type="button">
            <RotateCcw size={15} />
            <span>Replay</span>
          </button>
        </div>
        <div className={styles.volume}>
          <button aria-pressed={isMuted} onClick={onMuteToggle} type="button">
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>Volume</span>
          </button>
          <input
            aria-valuetext={isMuted ? 'Muted' : `${displayedVolumePercentage} percent`}
            className={styles.volumeRange}
            id={volumeInputId}
            max={maximumVolume}
            min={minimumVolume}
            onChange={(event) => {
              onVolumeChange(Number(event.target.value));
            }}
            step={volumeStep}
            type="range"
            value={displayedVolume}
          />
          <label htmlFor={volumeInputId}>{isMuted ? 'Muted' : `${displayedVolumePercentage}%`}</label>
        </div>
      </div>
    </div>
  );
};
