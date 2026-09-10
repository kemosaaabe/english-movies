import type { ReactNode } from 'react';

export type TypographyElement = 'h1' | 'h2' | 'p' | 'span';

export type TypographyProps = {
  as?: TypographyElement;
  children: ReactNode;
  className?: string;
  id?: string;
};
