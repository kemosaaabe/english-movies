import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import styles from './styles.modules.scss';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Checkbox = ({ id, label, checked, disabled, onCheckedChange }: CheckboxProps) => {
  return (
    <div className={styles.checkbox}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        disabled={disabled}
        className={styles.checkboxControl}
        onCheckedChange={(nextChecked) => {
          onCheckedChange(nextChecked === true);
        }}
      >
        <CheckboxPrimitive.Indicator className={styles.checkboxIndicator}>
          <Check size={14} strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
