import { AppHeader } from '@widgets/app-header';
import { UploadExerciseForm } from '@features/upload-exercise';
import { Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const UploadPage = () => {
  return (
    <div className={styles.page}>
      <AppHeader activeSection="moviePractice" />
      <main className={styles.main}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <Typography as="h1" className={styles.panelTitle} variant="h2">
              Add your files
            </Typography>
          </div>
          <UploadExerciseForm />
        </section>
      </main>
    </div>
  );
};
