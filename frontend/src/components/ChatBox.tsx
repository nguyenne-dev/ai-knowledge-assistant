import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, RotateCcw, FileText, Zap, Compass } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { ChatResponse } from '../types';
import { FormattedMessage } from './FormattedMessage';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: { source: string; section: string }[];
}

const QUICK_PROMPTS = [
  '⚡ Áo khoác Tech A01 giá bao nhiêu?',
  '📦 Chính sách đổi trả sản phẩm thế nào?',
  '🚚 Thời gian giao hàng mất bao lâu?',
  '📏 Tư vấn giúp tôi chọn size áo?'
];

export const ChatBox: React.FC = () => {
  const [conversationId, setConversationId] = useState<string>(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào quý khách! Tôi là trợ lý AI của Tech-Fashion. Tôi có thể hỗ trợ quý khách về thông tin sản phẩm, chính sách giao hàng, đổi trả hoặc tư vấn size chuẩn.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(userMsg.text, conversationId);
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Lỗi: Không thể nhận phản hồi (${err.message || 'Lỗi kết nối'}). Vui lòng thử lại.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setConversationId(`conv-${Date.now()}`);
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Cuộc trò chuyện đã được làm mới. Quý khách cần Tech-Fashion hỗ trợ gì thêm không ạ?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="glass-card chatbox-card">
      <div className="chatbox-header">
        <div className="chatbox-header-title">
          <div className="avatar-badge bot">
            <Zap size={18} />
          </div>
          <div>
            <h3>Trợ lý tư vấn AI ⚡ TechFashion</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#121212', background: 'var(--max-lime)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-pill)', border: '1.5px solid #121212' }}>
              🟢 LIVE RAG 24/7
            </span>
          </div>
        </div>

        <button type="button" onClick={resetChat} className="chatbox-reset-btn" title="Làm mới cuộc trò chuyện">
          <RotateCcw size={14} />
          Làm mới
        </button>
      </div>

      <div className="quick-prompts-bar">
        <Compass size={16} style={{ color: '#121212', flexShrink: 0 }} />
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button key={idx} type="button" className="quick-prompt-pill" onClick={(e) => handleSend(prompt.replace(/^[^\s]+\s/, ''), e)} disabled={isLoading}>
            {prompt}
          </button>
        ))}
      </div>

      <div ref={messagesContainerRef} className="messages-container">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className={`avatar-badge ${msg.sender}`}>
                {isUser ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div>
                <div className="message-bubble">
                  {isUser ? msg.text : <FormattedMessage content={msg.text} />}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="sources-card">
                      {msg.sources.map((src, i) => (
                        <span key={i} className="source-badge">
                          <FileText size={12} />
                          {src.source}: {src.section}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="message-row bot">
            <div className="avatar-badge bot">
              <Sparkles size={18} />
            </div>
            <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#121212', fontWeight: 600 }}>
              <Loader2 size={16} className="spin-anim" />
              <span>Đang tra cứu dữ liệu Qdrant và tạo phản hồi...</span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          className="chatbox-input"
          placeholder="Nhập câu hỏi về áo khoác A01, Hoodie T02, kích cỡ hoặc chính sách đổi trả..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button type="button" className="send-btn" onClick={(e) => handleSend(undefined, e)} disabled={isLoading || !inputText.trim()}>
          <Send size={16} />
          GỬI
        </button>
      </div>
    </div>
  );
};
