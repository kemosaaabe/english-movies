import { Typography } from '../typography';
import type { FormErrorProps } from './types';
import styles from './styles.modules.scss';

export const FormError = ({ children }: FormErrorProps) => (
  <Typography as="p" className={styles.error}>
    {children}
  </Typography>
);
