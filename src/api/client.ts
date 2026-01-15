import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, // 10 seconds for most requests
});

// Longer timeout for AI chat which can take time to generate responses
export const chatApi = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000, // 60 seconds for AI responses
});
