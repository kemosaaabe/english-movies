import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { AppHeader } from '@widgets/app-header';
import { ExercisePlayer } from '@widgets/exercise-player';
import { getExerciseProgress, useExerciseStore } from '@entities/exercise';
import { Button, Progress, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const ExercisePage = () => {
  const { currentSegmentIndex, reset, restoreExerciseVideo, segments, videoStorageId, videoUrl } = useExerciseStore();
  const [isVideoRestorePending, setIsVideoRestorePending] = useState(
    segments.length > 0 && Boolean(videoStorageId) && !videoUrl,
  );

  useEffect(() => {
    if (!isVideoRestorePending) {
      return;
    }

    let isActive = true;

    restoreExerciseVideo().then(() => {
      if (isActive) {
        setIsVideoRestorePending(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [isVideoRestorePending, restoreExerciseVideo]);

  if (isVideoRestorePending) {
    return (
      <div className={styles.page}>
        <AppHeader activeSection="moviePractice" />
        <main className={styles.empty}>
          <section className={styles.emptyCard}>
            <Typography as="h1" variant="h2">
              Restoring exercise
            </Typography>
            <Typography as="p" variant="bodyM">
              Loading your video and saved progress…
            </Typography>
          </section>
        </main>
      </div>
    );
  }

  if (segments.length === 0 || !videoUrl) {
    return (
      <div className={styles.page}>
        <AppHeader activeSection="moviePractice" />
        <main className={styles.empty}>
          <section className={styles.emptyCard}>
            <Typography as="h1" variant="h2">
              No exercise yet
            </Typography>
            <Typography as="p" variant="bodyM">
              Add a video and subtitle file first, then your listening session will appear here.
            </Typography>
            <Button asChild>
              <Link className={styles.startLink} to={routes.upload}>
                <Typography variant="bodyM">Choose files</Typography>
              </Link>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  const {
    currentClipNumber,
    currentExerciseNumber,
    currentExerciseSegmentCount,
    totalExercises,
    value: progress,
  } = getExerciseProgress(currentSegmentIndex, segments.length);

  return (
    <div className={styles.page}>
      <AppHeader activeSection="moviePractice" />
      <main className={styles.main}>
        <div className={styles.topline}>
          <Typography as="h1" className={styles.title} variant="h2">
            Exercise {String(currentExerciseNumber).padStart(2, '0')} of {String(totalExercises).padStart(2, '0')}
          </Typography>
          <div className={styles.toplineActions}>
            <Typography className={styles.counter} variant="bodyS">
              Clip {String(currentClipNumber).padStart(2, '0')} /{' '}
              {String(currentExerciseSegmentCount).padStart(2, '0')}
            </Typography>
            <Link className={styles.exit} onClick={reset} to={routes.upload}>
              <Typography variant="bodyS">End session</Typography>
            </Link>
          </div>
        </div>
        <section className={styles.progressPanel}>
          <div className={styles.progressMeta}>
            <span>Exercise progress</span>
            <strong>{Math.round(progress)}%</strong>
          </div>
          <Progress
            className={styles.progressRoot}
            indicatorClassName={styles.progressIndicator}
            indicatorStyle={{ transform: `translateX(-${100 - progress}%)` }}
            value={progress}
          />
          <div className={styles.progressCaption}>
            <span>
              {currentClipNumber} of {currentExerciseSegmentCount} clips
            </span>
          </div>
        </section>
        <ExercisePlayer />
      </main>
    </div>
  );
};
