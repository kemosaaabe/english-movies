import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Ref } from 'react';

import { emptySelectValue } from './constants';
import type { SelectOption } from './types';

import styles from './styles.modules.scss';

interface SelectProps {
  id: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export const Select = ({ id, value, options, onValueChange, onBlur, name, disabled, ref }: SelectProps) => {
  return (
    <SelectPrimitive.Root
      name={name}
      value={value || emptySelectValue}
      disabled={disabled}
      onValueChange={(nextValue) => {
        onValueChange(nextValue === emptySelectValue ? '' : nextValue);
      }}
    >
      <SelectPrimitive.Trigger id={id} ref={ref} onBlur={onBlur} className={styles.selectTrigger}>
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDown size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={styles.selectContent} position="popper" sideOffset={6}>
          <SelectPrimitive.ScrollUpButton className={styles.selectScroll}>
            <ChevronUp size={16} />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className={styles.selectViewport}>
            {options.map((option) => {
              return (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value || emptySelectValue}
                  className={styles.selectItem}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check size={16} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className={styles.selectScroll}>
            <ChevronDown size={16} />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};
