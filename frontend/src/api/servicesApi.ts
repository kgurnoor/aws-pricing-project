import apiClient from './apiClient';

export const fetchAllServices = async () => {
  const response = await apiClient.get('/getAllServices');
  return response.data;
};
