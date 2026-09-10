import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ExercisePage } from '@pages/exercise';
import { UploadPage } from '@pages/upload';
import { routes } from './constants';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path={routes.upload} element={<UploadPage />} />
      <Route path={routes.exercise} element={<ExercisePage />} />
      <Route path="*" element={<Navigate to={routes.upload} replace />} />
    </Routes>
  </BrowserRouter>
);
