import type { ReactNode } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type FormFileInputProps<FormValues extends FieldValues> = {
  accept: string;
  description: string;
  errorMessage?: string;
  fileName?: string;
  icon: ReactNode;
  label: string;
  name: Path<FormValues>;
  register: UseFormRegister<FormValues>;
};
