export interface NormalizedMessage {
  channel: 'website' | 'facebook' | 'zalo';
  userId: string;
  message: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface FacebookWebhookPayload {
  senderId: string;
  message: string;
  timestamp?: number;
}

export interface FacebookWebhookResponse {
  channel: 'facebook';
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
  sources?: Array<{ source: string; section: string }>;
  timestamp: string;
}

export interface ZaloWebhookPayload {
  senderId: string;
  message: string;
  appId?: string;
}

export interface ZaloWebhookResponse {
  channel: 'zalo';
  recipient: {
    user_id: string;
  };
  message: {
    text: string;
  };
  sources?: Array<{ source: string; section: string }>;
  timestamp: string;
}
