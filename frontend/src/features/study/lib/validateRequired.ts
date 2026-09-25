export const validateRequired = (value: string) => {
  return Boolean(value.trim()) || 'This field is required.';
};
