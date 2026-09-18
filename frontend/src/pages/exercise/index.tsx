import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { ExercisePlayer } from '@widgets/exercise-player';
import { getExerciseProgress, useExerciseStore } from '@entities/exercise';
import { Button, Logo, Progress, Typography } from '@shared/ui';

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
      <main className={styles.empty}>
        <section className={styles.emptyCard}>
          <Typography as="h1" variant="h1">
            Restoring exercise
          </Typography>
          <Typography as="p" variant="bodyM">
            Loading your video and saved progress…
          </Typography>
        </section>
      </main>
    );
  }

  if (segments.length === 0 || !videoUrl) {
    return (
      <main className={styles.empty}>
        <section className={styles.emptyCard}>
          <Typography as="h1" variant="h1">
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
    );
  }

  const {
    currentClipNumber,
    currentExerciseNumber,
    currentExerciseSegmentCount,
    totalExercises,
    value: progress,
  } = getExerciseProgress(currentSegmentIndex, segments.length);

  const handleExit = () => {
    reset();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <Link className={styles.exit} to={routes.upload} onClick={handleExit}>
          <Typography variant="bodyS">End session</Typography>
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.topline}>
          <div>
            <Typography as="p" className={styles.eyebrow} variant="caption">
              Exercise {String(currentExerciseNumber).padStart(2, '0')} of {String(totalExercises).padStart(2, '0')}
            </Typography>
            <Typography as="h1" className={styles.title} variant="h1">
              Catch every word.
            </Typography>
          </div>
          <Typography className={styles.counter} variant="bodyS">
            Clip {String(currentClipNumber).padStart(2, '0')} / {String(currentExerciseSegmentCount).padStart(2, '0')}
          </Typography>
        </div>
        <Progress
          className={styles.progressRoot}
          indicatorClassName={styles.progressIndicator}
          indicatorStyle={{ transform: `translateX(-${100 - progress}%)` }}
          value={progress}
        />
        <ExercisePlayer />
      </main>
    </div>
  );
};
