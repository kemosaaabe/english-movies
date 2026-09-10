import { httpClient } from '@shared/api';
import { subtitleApiRoutes, subtitleFormField } from '../constants';
import type { SubtitleSegment } from '../types';

export const parseSubtitles = async (subtitleFile: File) => {
  const formData = new FormData();
  formData.append(subtitleFormField, subtitleFile);

  const { data } = await httpClient.post<SubtitleSegment[]>(subtitleApiRoutes.parse, formData);

  return data;
};
