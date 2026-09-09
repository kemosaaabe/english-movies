import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.modules.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ asChild = false, children, className = '', variant = 'primary', ...props }: Props) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
