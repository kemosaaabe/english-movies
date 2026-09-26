import { useQueryClient } from '@tanstack/react-query';
import { LockKeyhole, UserRoundPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { useExerciseStore } from '@entities/exercise';
import { currentUserQueryKey, loginUser, registerUser } from '@entities/user';
import { HttpError } from '@shared/api';
import { Button, FormError } from '@shared/ui';

import type { AuthFormValues } from '../../types';
import styles from './styles.modules.scss';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetExercise = useExerciseStore((state) => {
    return state.reset;
  });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<AuthFormValues>({ defaultValues: { email: '', name: '', password: '' } });

  const handleValidSubmit = handleSubmit(async ({ email, name, password }) => {
    try {
      const user = mode === 'register'
        ? await registerUser({ email, name, password })
        : await loginUser({ email, password });

      queryClient.clear();
      resetExercise();
      queryClient.setQueryData(currentUserQueryKey, user);
      navigate(routes.upload, { replace: true });
    } catch (requestError) {
      const message = requestError instanceof HttpError ? requestError.message : 'Could not sign in. Try again.';

      setError('root', { message });
    }
  });

  return (
    <form className={styles.form} onSubmit={handleValidSubmit}>
      {mode === 'register' && (
        <div className={styles.field}>
          <label htmlFor="auth-name">Name</label>
          <input
            autoComplete="name"
            id="auth-name"
            {...register('name', { required: 'Enter your name.' })}
          />
          {errors.name?.message && <FormError>{errors.name.message}</FormError>}
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor="auth-email">Email</label>
        <input
          autoComplete="email"
          id="auth-email"
          type="email"
          {...register('email', { required: 'Enter your email.' })}
        />
        {errors.email?.message && <FormError>{errors.email.message}</FormError>}
      </div>
      <div className={styles.field}>
        <label htmlFor="auth-password">Password</label>
        <input
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          id="auth-password"
          type="password"
          {...register('password', {
            required: 'Enter your password.',
            minLength: mode === 'register' ? { value: 8, message: 'Use at least 8 characters.' } : 1,
          })}
        />
        {errors.password?.message && <FormError>{errors.password.message}</FormError>}
      </div>
      {errors.root?.message && <FormError>{errors.root.message}</FormError>}
      <Button disabled={isSubmitting} type="submit">
        {mode === 'register' ? <UserRoundPlus size={18} /> : <LockKeyhole size={18} />}
        {isSubmitting ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
      </Button>
      <p className={styles.switchMode}>
        {mode === 'register' ? 'Already have an account?' : 'New to ReelLingo?'}{' '}
        <Link to={mode === 'register' ? routes.login : routes.register}>
          {mode === 'register' ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </form>
  );
};
