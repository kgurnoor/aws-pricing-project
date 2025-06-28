import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if deploying elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
