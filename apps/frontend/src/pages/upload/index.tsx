import { UploadExerciseForm } from '@features/upload-exercise';
import { Brand } from '@shared/ui/brand';
import styles from './styles.modules.scss';

export const UploadPage = () => (
  <div className={styles.page}>
    <header className={styles.header}>
      <Brand />
    </header>
    <main className={styles.main}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>Listen · Type · Learn</p>
        <h1 className={styles.title}>
          Train your <span>movie ear.</span>
        </h1>
        <p className={styles.description}>
          Turn a scene you love into a focused listening workout. Add a video and its subtitles—we’ll build up to three exercises of 10 clips.
        </p>
      </section>
      <section className={styles.panel} aria-labelledby="upload-title">
        <div className={styles.panelHeader}>
          <span className={styles.step}>New session · 01</span>
          <h2 className={styles.panelTitle} id="upload-title">
            Add your files
          </h2>
        </div>
        <UploadExerciseForm />
      </section>
    </main>
    <footer className={styles.footer}>Private by design · No account needed</footer>
  </div>
);
