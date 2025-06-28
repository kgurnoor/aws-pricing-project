import apiClient from './apiClient';

export const fetchVerifiedPermissionsFile = async (file: 'index-version' | 'index-current-version' | 'index-current-region') => {
  const response = await apiClient.get(`/verifiedpermissions/${file}`);
  return response.data;
};
