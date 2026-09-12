import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ExercisePage } from '@pages/exercise';
import { UploadPage } from '@pages/upload';
import { routes } from './constants';

const router = createBrowserRouter([
  {
    path: routes.upload,
    Component: UploadPage,
  },
  {
    path: routes.exercise,
    Component: ExercisePage,
  },
  {
    path: '*',
    element: <Navigate to={routes.upload} replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
