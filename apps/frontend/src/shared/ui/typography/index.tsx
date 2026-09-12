import type { TypographyProps } from './types';
import styles from './styles.modules.scss';

export const Typography = ({
  as: Component = 'span',
  children,
  className = '',
  id,
  variant,
}: TypographyProps) => (
  <Component className={`${styles.typography} ${variant ? styles[variant] : ''} ${className}`} id={id}>
    {children}
  </Component>
);
