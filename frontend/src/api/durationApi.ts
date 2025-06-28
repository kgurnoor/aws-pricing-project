// src/api/durationApi.ts
import apiClient from './apiClient';

export const fetchDurations = async () => {
  const response = await apiClient.get('/durations');
  return response.data;
};
