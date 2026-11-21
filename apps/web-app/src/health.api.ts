import type { HealthResponse } from './types/health';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${baseUrl}/health`);
  if (!response.ok) {
    throw new Error(`Error en el servidor: HTTP ${response.status}`);
  }
  return response.json();
};