import { useFormContext } from 'react-hook-form';

import type { ModuleInput } from '@entities/study';

import { validateRequired } from '../../lib/validateRequired';

import styles from './styles.modules.scss';

export const ModuleDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ModuleInput>();

  return (
    <section className={styles.details}>
      <h2>Module details</h2>
      <label htmlFor="module-title">Title</label>
      <input
        id="module-title"
        placeholder="e.g. Words from my favorite movies"
        {...register('title', { validate: validateRequired })}
      />
      {errors.title && <p role="alert">{errors.title.message}</p>}
      <label htmlFor="module-description">
        Description <span>Optional</span>
      </label>
      <textarea
        id="module-description"
        rows={3}
        placeholder="What would you like to remember?"
        {...register('description')}
      />
    </section>
  );
};
