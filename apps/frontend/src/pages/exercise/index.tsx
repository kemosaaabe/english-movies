import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { ExercisePlayer } from '@widgets/exercise-player';
import { getExerciseProgress, useExerciseStore } from '@entities/exercise';
import { Button, Logo, Progress, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const ExercisePage = () => {
  const { currentSegmentIndex, reset, segments, videoUrl } = useExerciseStore();

  if (segments.length === 0 || !videoUrl) {
    return (
      <main className={styles.empty}>
        <section className={styles.emptyCard}>
          <Typography as="h1">No exercise yet</Typography>
          <Typography as="p">
            Add a video and subtitle file first, then your listening session will appear here.
          </Typography>
          <Button asChild>
            <Link className={styles.startLink} to={routes.upload}>
              <Typography>Choose files</Typography>
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
    URL.revokeObjectURL(videoUrl);
    reset();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <Link className={styles.exit} to={routes.upload} onClick={handleExit}>
          <Typography>End session</Typography>
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.topline}>
          <div>
            <Typography as="p" className={styles.eyebrow}>
              Exercise {String(currentExerciseNumber).padStart(2, '0')} of {String(totalExercises).padStart(2, '0')}
            </Typography>
            <Typography as="h1" className={styles.title}>
              Catch every word.
            </Typography>
          </div>
          <Typography className={styles.counter}>
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
