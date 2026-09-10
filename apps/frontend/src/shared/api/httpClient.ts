import axios, { type AxiosError } from 'axios';
import { apiBaseUrl } from './constants';
import { HttpError } from './HttpError';
import type { HttpErrorResponse } from './types';

const handleHttpError = (error: AxiosError<HttpErrorResponse>) => {
  const message = error.response?.data.message ?? error.message;
  const status = error.response?.status;

  return Promise.reject(new HttpError(message, status));
};

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
});

httpClient.interceptors.response.use((response) => response, handleHttpError);
