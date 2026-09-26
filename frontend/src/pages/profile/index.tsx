import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { AppHeader } from '@widgets/app-header';
import { useExerciseStore } from '@entities/exercise';
import { logoutUser, useCurrentUser } from '@entities/user';
import { HttpError } from '@shared/api';
import { Button, FormError } from '@shared/ui';

import styles from './styles.modules.scss';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const resetExercise = useExerciseStore((state) => {
    return state.reset;
  });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError('');

    try {
      await logoutUser();
      queryClient.clear();
      resetExercise();
      navigate(routes.login, { replace: true });
    } catch (requestError) {
      const message = requestError instanceof HttpError ? requestError.message : 'Could not sign out. Try again.';

      setSignOutError(message);
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <AppHeader activeSection="profile" />
      <main className={styles.main}>
        <section className={styles.panel}>
          <div>
            <p className={styles.eyebrow}>Your account</p>
            <h1>{user.name}</h1>
          </div>
          <dl className={styles.details}>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
          {signOutError && <FormError>{signOutError}</FormError>}
          <Button disabled={isSigningOut} onClick={handleSignOut} type="button" variant="secondary">
            <LogOut size={18} />
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </section>
      </main>
    </div>
  );
};
