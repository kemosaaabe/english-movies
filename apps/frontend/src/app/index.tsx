import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AppQueryClientProvider } from './providers/query-client-provider';
import { AppRouter } from './router';

export const App = () => (
  <AppQueryClientProvider>
    <TooltipProvider delayDuration={300}>
      <AppRouter />
    </TooltipProvider>
  </AppQueryClientProvider>
);
