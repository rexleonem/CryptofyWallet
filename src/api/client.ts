import axios from 'axios';
import { API_BASE_URL, DEV_API_BASE_URL } from '@env';

// Base URL for the NestJS backend
const BASE_URL = __DEV__ ? (DEV_API_BASE_URL || 'http://10.0.2.2:3000') : API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  // Normally add auth tokens here
  return config;
});
