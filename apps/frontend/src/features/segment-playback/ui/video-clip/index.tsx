import { RotateCcw } from 'lucide-react';
import { useRef } from 'react';

import { Button, Typography } from '@shared/ui';

import { millisecondsPerSecond } from '../../constants';
import { getPlaybackEndTime, getPlaybackStartTime } from '../../lib';
import { useSegmentPlayback } from '../../model';
import type { VideoClipProps } from '../../types';
import styles from './styles.modules.scss';

export const VideoClip = ({ clipNumber, currentSegment, videoUrl }: VideoClipProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = getPlaybackStartTime(currentSegment.startTime);
  const endTime = getPlaybackEndTime(currentSegment.endTime, currentSegment.text);
  const { handleTimeUpdate, replay } = useSegmentPlayback({
    endTime,
    startTime,
    videoRef,
  });

  return (
    <section className={styles.videoPanel}>
      <div className={styles.videoWrap}>
        <video className={styles.video} ref={videoRef} src={videoUrl} onTimeUpdate={handleTimeUpdate} playsInline />
        <Typography className={styles.videoBadge}>
          <span className={styles.liveDot} /> Clip {clipNumber}
        </Typography>
      </div>
      <div className={styles.videoControls}>
        <Typography className={styles.clipTime}>
          {(startTime / millisecondsPerSecond).toFixed(1)}s—
          {(endTime / millisecondsPerSecond).toFixed(1)}s
        </Typography>
        <Button className={styles.replay} variant="secondary" type="button" onClick={replay}>
          <RotateCcw size={16} />
          <Typography>Replay</Typography>
        </Button>
      </div>
    </section>
  );
};
