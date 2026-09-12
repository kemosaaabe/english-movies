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
        <Typography as="p" className={styles.eyebrow}>
          Listen · Type · Learn
        </Typography>
        <Typography as="h1" className={styles.title}>
          Train your
          <Typography>movie ear.</Typography>
        </Typography>
        <Typography as="p" className={styles.description}>
          Turn a scene you love into a focused listening workout. Add a video and its subtitles—we’ll build up to three
          exercises of 10 clips.
        </Typography>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <Typography className={styles.step}>New session · 01</Typography>
          <Typography as="h2" className={styles.panelTitle}>
            Add your files
          </Typography>
        </div>
        <UploadExerciseForm />
      </section>
    </main>
    <footer className={styles.footer}>
      <Typography>Private by design · No account needed</Typography>
    </footer>
  </div>
);
