import type { ReactNode } from 'react';

export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

export type TypographyVariant = 'caption' | 'bodyS' | 'bodyM' | 'bodyL' | 'h1' | 'h2' | 'h3' | 'h4';

export type TypographyProps = {
  as?: TypographyElement;
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: TypographyVariant;
};
