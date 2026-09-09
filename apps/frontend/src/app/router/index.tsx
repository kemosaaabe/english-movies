import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ExercisePage } from '@pages/exercise';
import { UploadPage } from '@pages/upload';
import { exerciseRoute, uploadRoute } from './constants';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path={uploadRoute} element={<UploadPage />} />
      <Route path={exerciseRoute} element={<ExercisePage />} />
      <Route path="*" element={<Navigate to={uploadRoute} replace />} />
    </Routes>
  </BrowserRouter>
);
