import type { TypographyProps } from './types';
import styles from './styles.modules.scss';

export const Typography = ({
  as: Component = 'span',
  children,
  className = '',
  id,
}: TypographyProps) => (
  <Component className={`${styles.typography} ${className}`} id={id}>{children}</Component>
);
