import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { ExercisePage } from '@pages/exercise';
import { StudyPage } from '@pages/study';
import { UploadPage } from '@pages/upload';
import { VocabularyPage } from '@pages/vocabulary';

import { routes } from './constants';

const router = createBrowserRouter([
  { path: routes.vocabulary, Component: VocabularyPage },
  { path: routes.study, Component: StudyPage },
  { path: routes.studyModule, Component: StudyPage },
  { path: routes.studyActivity, Component: StudyPage },
  {
    path: routes.upload,
    Component: UploadPage,
  },
  {
    path: routes.exercise,
    Component: ExercisePage,
  },
  {
    path: routes.trim,
    lazy: async () => {
      const { TrimPage } = await import('@pages/trim');

      return { Component: TrimPage };
    },
  },
  {
    path: '*',
    element: <Navigate to={routes.upload} replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
