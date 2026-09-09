import { createRoot } from 'react-dom/client';
import { App } from '@app/index';
import '@app/styles/styles.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

createRoot(rootElement).render(<App />);
