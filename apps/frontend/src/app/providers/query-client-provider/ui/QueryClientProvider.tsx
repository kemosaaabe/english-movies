import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../constants';
import type { AppQueryClientProviderProps } from '../types';

export const AppQueryClientProvider = ({ children }: AppQueryClientProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
