const defaultApiUrl = import.meta.env.PROD ? '/api' : 'http://localhost:3001';
const configuredApiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '');