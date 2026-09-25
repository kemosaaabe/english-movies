import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { UploadExerciseForm } from '@features/upload-exercise';
import { Button, Logo, Typography } from '@shared/ui';

import styles from './styles.modules.scss';

export const UploadPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo to={routes.upload} />
        <nav className={styles.headerNavigation}>
          <Button asChild variant="ghost">
            <Link to={routes.study}>Modules</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to={routes.vocabulary}>Vocabulary</Link>
          </Button>
        </nav>
      </header>
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
