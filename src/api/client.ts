import axios from 'axios';

// The base URL would typically point to the NestJS backend
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  // Normally add auth tokens here
  return config;
});
