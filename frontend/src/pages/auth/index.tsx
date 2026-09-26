import { routes } from '@app/router/constants';
import { AuthForm } from '@features/auth';
import { Logo } from '@shared/ui';

import styles from './styles.modules.scss';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <Logo to={routes.upload} />
        <div className={styles.intro}>
          <h1>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1>
          <p>
            {mode === 'register'
              ? 'Save your vocabulary and learning progress in a private account.'
              : 'Sign in to continue your movie practice and vocabulary.'}
          </p>
        </div>
        <AuthForm mode={mode} />
      </section>
    </main>
  );
};
