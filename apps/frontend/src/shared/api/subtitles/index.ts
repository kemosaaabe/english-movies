import axios from 'axios';
import type { SubtitleSegment } from '@entities/subtitle-segment';
import { subtitleFormField, subtitleParsePath } from '../constants';
import { apiClient } from '../model';

interface ApiErrorResponse {
  message: string;
}

export const parseSubtitles = async (file: File): Promise<SubtitleSegment[]> => {
  const formData = new FormData();
  formData.append(subtitleFormField, file);

  try {
    const response = await apiClient.post<SubtitleSegment[]>(subtitleParsePath, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw new Error(error.response?.data.message ?? error.message);
    }

    throw error;
  }
};
