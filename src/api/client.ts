import axios from 'axios';
import { API_BASE_URL } from '@env';

// Base URL for the NestJS backend
const BASE_URL = API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  // Normally add auth tokens here
  return config;
});
