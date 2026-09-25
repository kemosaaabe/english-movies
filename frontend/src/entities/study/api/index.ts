import { httpClient } from '@shared/api';

import type {
  CardInput,
  FlashcardStatus,
  LearnSession,
  ModuleDetail,
  ModuleInput,
  SessionAction,
  SessionInput,
  StudyModule,
} from '../types';

export const listModules = async () => {
  const response = await httpClient.get<StudyModule[]>('/study/modules');

  return response.data;
};

export const getModule = async (id: string) => {
  const response = await httpClient.get<ModuleDetail>(`/study/modules/${id}`);

  return response.data;
};

export const saveModule = async (input: ModuleInput, id?: string) => {
  const response = id
    ? await httpClient.patch<StudyModule>(`/study/modules/${id}`, input)
    : await httpClient.post<StudyModule>('/study/modules', input);

  return response.data;
};

export const deleteModule = async (id: string) => {
  await httpClient.delete(`/study/modules/${id}`);
};

export const appendCard = async (id: string, input: CardInput) => {
  await httpClient.post(`/study/modules/${id}/cards`, input);
};

export const markCard = async (id: string, cardId: string, status: FlashcardStatus) => {
  await httpClient.patch(`/study/modules/${id}/cards/${cardId}/status`, { status });
};

export const resetProgress = async (id: string) => {
  await httpClient.delete(`/study/modules/${id}/progress`);
};

export const sessionAction = async (id: string, action: SessionAction, input: SessionInput = {}) => {
  const response = await httpClient.post<LearnSession>(`/study/modules/${id}/session/${action}`, input);

  return response.data;
};
