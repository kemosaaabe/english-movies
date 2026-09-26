import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AuthPage } from '@pages/auth';
import { ExercisePage } from '@pages/exercise';
import { ProfilePage } from '@pages/profile';
import { StudyPage } from '@pages/study';
import { UploadPage } from '@pages/upload';
import { VocabularyPage } from '@pages/vocabulary';

import { routes } from './constants';
import { ProtectedRoute } from './ui/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: routes.login,
    element: <AuthPage mode="login" />,
  },
  {
    path: routes.register,
    element: <AuthPage mode="register" />,
  },
  {
    Component: ProtectedRoute,
    children: [
      { path: routes.vocabulary, Component: VocabularyPage },
      { path: routes.study, Component: StudyPage },
      { path: routes.studyModule, Component: StudyPage },
      { path: routes.studyActivity, Component: StudyPage },
      { path: routes.profile, Component: ProfilePage },
      { path: routes.upload, Component: UploadPage },
      { path: routes.exercise, Component: ExercisePage },
      {
        path: routes.trim,
        lazy: async () => {
          const { TrimPage } = await import('@pages/trim');

          return { Component: TrimPage };
        },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={routes.upload} replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
