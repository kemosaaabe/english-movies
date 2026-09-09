import * as Progress from '@radix-ui/react-progress';
import { Link } from 'react-router-dom';
import { uploadRoute } from '@app/router/constants';
import { useExerciseStore } from '@features/exercise';
import { Brand } from '@shared/ui/brand';
import { Button } from '@shared/ui/button';
import { ExercisePlayer } from '@widgets/exercise-player';
import styles from './styles.modules.scss';

export const ExercisePage = () => {
  const currentSegmentIndex = useExerciseStore((state) => state.currentSegmentIndex);
  const reset = useExerciseStore((state) => state.reset);
  const segments = useExerciseStore((state) => state.segments);
  const videoUrl = useExerciseStore((state) => state.videoUrl);

  if (segments.length === 0 || !videoUrl) {
    return (
      <main className={styles.empty}>
        <section className={styles.emptyCard}>
          <h1>No exercise yet</h1>
          <p>Add a video and subtitle file first, then your listening session will appear here.</p>
          <Button asChild>
            <Link className={styles.startLink} to={uploadRoute}>
              Choose files
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const progress = ((currentSegmentIndex + 1) / segments.length) * 100;

  const handleExit = (): void => {
    URL.revokeObjectURL(videoUrl);
    reset();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Brand />
        <Link className={styles.exit} to={uploadRoute} onClick={handleExit}>
          End session
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.topline}>
          <div>
            <p className={styles.eyebrow}>Listening session</p>
            <h1 className={styles.title}>Catch every word.</h1>
          </div>
          <span className={styles.counter}>
            Clip {String(currentSegmentIndex + 1).padStart(2, '0')} / {String(segments.length).padStart(2, '0')}
          </span>
        </div>
        <Progress.Root className={styles.progressRoot} value={progress} aria-label="Exercise progress">
          <Progress.Indicator className={styles.progressIndicator} style={{ transform: `translateX(-${100 - progress}%)` }} />
        </Progress.Root>
        <ExercisePlayer />
      </main>
    </div>
  );
};
