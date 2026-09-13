import { Link, Navigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { useExerciseStore } from '@entities/exercise';
import { TrimVideoForm } from '@features/trim-video';
import { Logo, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const TrimPage = () => {
  const { reset, segments, sourceSegments, sourceVideoFile, videoUrl } = useExerciseStore();

  if (!sourceVideoFile || sourceSegments.length === 0) {
    const redirectRoute = segments.length > 0 && videoUrl ? routes.exercise : routes.upload;

    return <Navigate replace to={redirectRoute} />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <Link className={styles.back} onClick={reset} to={routes.upload}>
          <Typography variant="bodyS">Choose different files</Typography>
        </Link>
      </header>
      <main className={styles.main}>
        <section className={styles.intro}>
          <Typography as="p" className={styles.eyebrow} variant="caption">
            New session · 02
          </Typography>
          <Typography as="h1" className={styles.title} variant="h1">
            Trim your scene.
          </Typography>
          <Typography as="p" className={styles.description} variant="bodyL">
            Choose the exact part of the video you want to practice. We’ll turn every 10 subtitle segments into an
            exercise.
          </Typography>
        </section>
        <TrimVideoForm segments={sourceSegments} videoFile={sourceVideoFile} />
      </main>
    </div>
  );
};
