export interface ChatMessageHistory {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface SessionData {
  messages: ChatMessageHistory[];
  lastActive: number;
}

export class ConversationService {
  private sessions: Map<string, SessionData> = new Map();
  private maxHistoryPerSession = 8;
  private sessionTtlMs = 60 * 60 * 1000; // 1 hour TTL

  constructor() {
    // Periodically clean up expired sessions every 15 minutes
    setInterval(() => this.cleanupExpiredSessions(), 15 * 60 * 1000).unref();
  }

  /**
   * Appends a message to conversation history.
   */
  addMessage(conversationId: string, role: 'user' | 'assistant', content: string): void {
    if (!conversationId) return;

    let session = this.sessions.get(conversationId);
    if (!session) {
      session = { messages: [], lastActive: Date.now() };
      this.sessions.set(conversationId, session);
    }

    session.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });

    session.lastActive = Date.now();

    // Keep only the most recent N messages
    if (session.messages.length > this.maxHistoryPerSession) {
      session.messages = session.messages.slice(-this.maxHistoryPerSession);
    }
  }

  /**
   * Retrieves message history for a given conversation.
   */
  getHistory(conversationId: string): ChatMessageHistory[] {
    const session = this.sessions.get(conversationId);
    return session ? [...session.messages] : [];
  }

  /**
   * Formats conversation history into clean readable dialogue for LLM prompting.
   */
  formatHistoryForPrompt(conversationId: string): string {
    const history = this.getHistory(conversationId);
    if (history.length === 0) return '';

    return history
      .map((msg) => `${msg.role === 'user' ? 'Khách hàng' : 'Trợ lý'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Enriches a follow-up query with context from previous turns if it refers to prior topics.
   * e.g. "Nó có màu gì?" -> "Áo khoác Tech A01 Nó có màu gì?"
   */
  enrichQueryWithContext(query: string, conversationId: string): string {
    const history = this.getHistory(conversationId);
    if (history.length === 0) return query;

    const lowerQuery = query.toLowerCase();
    const pronouns = ['nó', 'sản phẩm đó', 'sản phẩm này', 'áo này', 'cái đó', 'màu gì', 'size gì', 'giá bao nhiêu', 'bảo hành bao lâu'];
    const isFollowUp = pronouns.some((p) => lowerQuery.includes(p)) || query.trim().split(/\s+/).length <= 4;

    if (!isFollowUp) {
      return query;
    }

    // Look back for product keywords or subjects mentioned in previous turns
    for (let i = history.length - 1; i >= 0; i--) {
      const prev = history[i];
      const match = prev.content.match(/(Áo khoác Tech A01|Tech Hoodie T02|A01|T02|đổi trả|giao hàng|vận chuyển|bảo hành)/i);
      if (match) {
        return `${match[0]} ${query}`;
      }
    }

    return query;
  }

  /**
   * Clears a conversation session.
   */
  clearSession(conversationId: string): void {
    this.sessions.delete(conversationId);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActive > this.sessionTtlMs) {
        this.sessions.delete(id);
      }
    }
  }
}

export const conversationService = new ConversationService();
