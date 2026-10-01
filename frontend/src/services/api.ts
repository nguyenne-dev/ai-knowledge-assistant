import { HealthResponse, ChatResponse } from '../types/index.js';

const API_BASE = '/api';

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch health check:', error);
    return {
      status: 'error',
    };
  }
};

export const sendChatMessage = async (
  message: string,
  conversationId?: string
): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Chat request failed: ${response.status}`);
  }

  return await response.json();
};
