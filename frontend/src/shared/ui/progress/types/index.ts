import type { CSSProperties } from 'react';

export type ProgressProps = {
  className?: string;
  indicatorClassName?: string;
  indicatorStyle?: CSSProperties;
  value: number;
};
