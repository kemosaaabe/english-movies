import { UploadExerciseForm } from '@features/upload-exercise';
import { Logo, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const UploadPage = () => (
  <div className={styles.page}>
    <header className={styles.header}>
      <Logo />
    </header>
    <main className={styles.main}>
      <section className={styles.intro}>
        <Typography as="p" className={styles.eyebrow} variant="caption">
          Listen · Type · Learn
        </Typography>
        <Typography as="h1" className={styles.title} variant="h1">
          Train your
          <Typography variant="h1">movie ear.</Typography>
        </Typography>
        <Typography as="p" className={styles.description} variant="bodyL">
          Turn a scene you love into a focused listening workout. Add a video and its subtitles—we’ll build up to three
          exercises of 10 clips.
        </Typography>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <Typography className={styles.step} variant="caption">
            New session · 01
          </Typography>
          <Typography as="h2" className={styles.panelTitle} variant="h2">
            Add your files
          </Typography>
        </div>
        <UploadExerciseForm />
      </section>
    </main>
    <footer className={styles.footer}>
      <Typography variant="caption">Private by design · No account needed</Typography>
    </footer>
  </div>
);
