import React, { useState } from 'react';
import { Share2, Send, CheckCircle2 } from 'lucide-react';

// Crisp native SVG for Meta Facebook Messenger
const MessengerIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M12 2C6.48 2 2 6.13 2 11.23c0 2.9 1.45 5.5 3.72 7.16V22l3.41-1.87c.91.25 1.87.39 2.87.39 5.52 0 10-4.13 10-9.23C22 6.13 17.52 2 12 2z"
      fill="#0084FF"
    />
    <path
      d="M6.5 13.5l3.5-5.5 3.5 3.5 4-3.5-3.5 5.5-3.5-3.5-4 3.5z"
      fill="#FFFFFF"
    />
  </svg>
);

// Crisp native SVG for Zalo Official Account
const ZaloIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <rect width="24" height="24" rx="6" fill="#0068FF" />
    <path
      d="M6 7.5h11L8.5 16.5H18"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16.5" cy="7.5" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const WebhookSimulator: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'facebook' | 'zalo'>('facebook');
  const [message, setMessage] = useState('Shop ơi, mình cao 1m72 nặng 65kg thì mặc Áo khoác Tech A01 size L hay XL vừa form?');
  const [senderId, setSenderId] = useState('fb-customer-888');
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);

  const handleChannelChange = (channel: 'facebook' | 'zalo') => {
    setActiveChannel(channel);
    if (channel === 'facebook') {
      setSenderId('fb-customer-888');
      setMessage('Shop ơi, mình cao 1m72 nặng 65kg thì mặc Áo khoác Tech A01 size L hay XL vừa form?');
    } else {
      setSenderId('zalo-oa-user-999');
      setMessage('Cho mình hỏi nếu nhận áo không vừa size thì chính sách đổi trả hàng như thế nào shop?');
    }
    setResponseJson(null);
  };

  const handleSendWebhook = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setResponseJson(null);

    try {
      const endpoint = activeChannel === 'facebook' ? '/webhooks/facebook' : '/webhooks/zalo';
      const payload = {
        senderId,
        message,
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponseJson(data);
    } catch (err: any) {
      setResponseJson({
        error: true,
        message: err.message || 'Webhook simulation failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card webhook-sim-card">
      <div className="section-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div className="avatar-badge" style={{ background: 'var(--max-yellow)', width: 34, height: 34 }}>
              <Share2 size={18} color="#121212" />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
              Multi-Channel Webhook Simulator
            </h2>
            <span className="brand-badge-tag" style={{ background: 'var(--max-lime)' }}>
              SOCIAL ADAPTERS
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
            Mô phỏng bộ chuyển đổi Webhook đa kênh: Chuẩn hóa tin nhắn khách hàng từ Facebook Messenger và Zalo OA sang RAG Chat Service nội bộ.
          </p>
        </div>
      </div>

      {/* Channel Switcher */}
      <div className="channel-btn-group">
        <button
          type="button"
          onClick={() => handleChannelChange('facebook')}
          className={`channel-btn ${activeChannel === 'facebook' ? 'active fb' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}
        >
          <MessengerIcon size={18} />
          Facebook Messenger
        </button>

        <button
          type="button"
          onClick={() => handleChannelChange('zalo')}
          className={`channel-btn ${activeChannel === 'zalo' ? 'active zalo' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}
        >
          <ZaloIcon size={18} />
          Zalo Official Account
        </button>
      </div>

      {/* Simulator Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#121212', marginBottom: '0.4rem' }}>
            Sender ID (Simulated Social Account ID):
          </label>
          <input
            type="text"
            className="chatbox-input"
            style={{ width: '100%' }}
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#121212', marginBottom: '0.4rem' }}>
            Message Payload:
          </label>
          <input
            type="text"
            className="chatbox-input"
            style={{ width: '100%' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSendWebhook}
        disabled={isLoading || !message.trim()}
        className="send-btn"
        style={{ width: 'auto', alignSelf: 'flex-start' }}
      >
        <Send size={16} />
        {isLoading ? 'Processing Adapter...' : `Gửi POST /webhooks/${activeChannel}`}
      </button>

      {/* Response Box */}
      {responseJson && (
        <div className="diagnostic-box" style={{ marginTop: '1.5rem', boxShadow: '4px 4px 0px var(--max-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--max-cyan)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            <CheckCircle2 size={16} />
            <span>Normalized Webhook Response ({activeChannel.toUpperCase()} Channel Format):</span>
          </div>
          <pre>{JSON.stringify(responseJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
