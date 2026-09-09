import axios from 'axios';
import { apiBaseUrl } from '../constants';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});
