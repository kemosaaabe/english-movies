import { AppQueryClientProvider } from './providers/query-client-provider';
import { AppRouter } from './router';

export const App = () => (
  <AppQueryClientProvider>
    <AppRouter />
  </AppQueryClientProvider>
);
