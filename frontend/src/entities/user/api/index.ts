import { httpClient } from '@shared/api';

import type { LoginUserInput, RegisterUserInput, UserProfile } from '../types';

export const getCurrentUser = async () => {
  const response = await httpClient.get<UserProfile>('/auth/me');

  return response.data;
};

export const loginUser = async (input: LoginUserInput) => {
  const response = await httpClient.post<UserProfile>('/auth/login', input);

  return response.data;
};

export const registerUser = async (input: RegisterUserInput) => {
  const response = await httpClient.post<UserProfile>('/auth/register', input);

  return response.data;
};

export const logoutUser = async () => {
  await httpClient.post('/auth/logout');
};
