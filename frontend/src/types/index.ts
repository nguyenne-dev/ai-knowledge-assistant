export interface HealthResponse {
  status: 'ok' | 'error' | string;
  timestamp?: string;
  uptime?: number;
  service?: string;
  version?: string;
  qdrant?: any;
  [key: string]: any;
}

export interface ChatSource {
  source: string;
  section: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  conversationId?: string;
}
