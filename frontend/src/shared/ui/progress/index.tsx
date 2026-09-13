import * as ProgressPrimitive from '@radix-ui/react-progress';

import type { ProgressProps } from './types';
import styles from './styles.modules.scss';

export const Progress = ({ className, indicatorClassName, indicatorStyle, value }: ProgressProps) => (
  <ProgressPrimitive.Root className={`${styles.progress} ${className ?? ''}`} value={value}>
    <ProgressPrimitive.Indicator className={indicatorClassName} style={indicatorStyle} />
  </ProgressPrimitive.Root>
);
