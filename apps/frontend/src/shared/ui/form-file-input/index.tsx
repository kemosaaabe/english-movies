import { useId } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormError } from '../form-error';
import { Typography } from '../typography';
import type { FormFileInputProps } from './types';
import styles from './styles.modules.scss';

export const FormFileInput = <FormValues extends FieldValues>({
  accept,
  description,
  errorMessage,
  fileName,
  icon,
  label,
  name,
  register,
}: FormFileInputProps<FormValues>) => {
  const inputId = useId();

  return (
    <div className={styles.group}>
      <label className={styles.field} htmlFor={inputId}>
        <input className={styles.input} id={inputId} type="file" accept={accept} {...register(name)} />
        <span className={styles.icon}>{icon}</span>
        <span className={styles.copy}>
          <Typography className={styles.label} variant="bodyL">
            {label}
          </Typography>
          <Typography className={fileName ? styles.fileName : styles.description} variant="bodyS">
            {fileName ?? description}
          </Typography>
        </span>
      </label>
      {errorMessage && <FormError>{errorMessage}</FormError>}
    </div>
  );
};
