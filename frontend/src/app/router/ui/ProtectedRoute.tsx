import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentUser } from '@entities/user';
import { HttpError } from '@shared/api';
import { Button } from '@shared/ui';

import { routes } from '../constants';
import styles from './styles.modules.scss';

export const ProtectedRoute = () => {
  const userQuery = useCurrentUser();

  if (userQuery.isPending) {
    return <main className={styles.status}>Loading your account…</main>;
  }

  if (userQuery.error instanceof HttpError && userQuery.error.status === 401) {
    return <Navigate replace to={routes.login} />;
  }

  if (userQuery.error) {
    return (
      <main className={styles.status} role="alert">
        <p>Could not load your account. {userQuery.error.message}</p>
        <Button
          onClick={() => {
            void userQuery.refetch();
          }}
          type="button"
        >
          Try again
        </Button>
      </main>
    );
  }

  return <Outlet />;
};
