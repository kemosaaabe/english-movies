import { Slot } from '@radix-ui/react-slot';
import type { ButtonProps } from './types';
import styles from './styles.modules.scss';

export const Button = ({ asChild = false, children, className = '', variant = 'primary', ...props }: ButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
