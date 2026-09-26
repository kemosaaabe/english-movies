import { Navigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { AppHeader } from '@widgets/app-header';
import { TrimVideoForm } from '@features/trim-video';
import { useExerciseStore } from '@entities/exercise';
import { BackLink, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const TrimPage = () => {
  const { reset, segments, sourceSegments, sourceVideoFile, videoUrl } = useExerciseStore();

  if (!sourceVideoFile || sourceSegments.length === 0) {
    const redirectRoute = segments.length > 0 && videoUrl ? routes.exercise : routes.upload;

    return <Navigate replace to={redirectRoute} />;
  }

  return (
    <div className={styles.page}>
      <AppHeader activeSection="moviePractice" />
      <main className={styles.main}>
        <BackLink onClick={reset} to={routes.upload}>
          Choose different files
        </BackLink>
        <section className={styles.intro}>
          <Typography as="h1" className={styles.title} variant="h1">
            Trim video
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
