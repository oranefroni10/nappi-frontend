import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds for most requests
});

// Longer timeout for AI chat which can take time to generate responses
export const chatApi = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds for AI responses
});
