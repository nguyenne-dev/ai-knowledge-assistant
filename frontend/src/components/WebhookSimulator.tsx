import React, { useState } from 'react';
import { Share2, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export const WebhookSimulator: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'facebook' | 'zalo'>('facebook');
  const [message, setMessage] = useState('Áo A01 giá bao nhiêu và có size XL không?');
  const [senderId, setSenderId] = useState('fb-customer-888');
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);

  const handleChannelChange = (channel: 'facebook' | 'zalo') => {
    setActiveChannel(channel);
    if (channel === 'facebook') {
      setSenderId('fb-customer-888');
      setMessage('Áo A01 giá bao nhiêu và có size XL không?');
    } else {
      setSenderId('zalo-oa-user-999');
      setMessage('Chính sách đổi trả hàng như thế nào?');
    }
    setResponseJson(null);
  };

  const handleSendWebhook = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setResponseJson(null);

    try {
      const endpoint = activeChannel === 'facebook' ? '/webhooks/facebook' : '/webhooks/zalo';
      const payload = { senderId, message };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponseJson(data);
    } catch (err: any) {
      setResponseJson({ error: true, message: err.message || 'Webhook simulation failed' });
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
            <h2 className="section-title" style={{ fontSize: '1.35rem' }}>Multi-Channel Webhook Simulator</h2>
            <span className="brand-badge-tag" style={{ background: 'var(--max-lime)' }}>⚡ ADAPTERS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
            Test normalized webhook adapters converting external social channel payloads into internal RAG Chat Service.
          </p>
        </div>
      </div>

      <div className="channel-btn-group">
        <button type="button" onClick={() => handleChannelChange('facebook')} className={`channel-btn ${activeChannel === 'facebook' ? 'active fb' : ''}`}>
          <MessageCircle size={16} /> Facebook Messenger
        </button>
        <button type="button" onClick={() => handleChannelChange('zalo')} className={`channel-btn ${activeChannel === 'zalo' ? 'active zalo' : ''}`}>
          <MessageCircle size={16} /> Zalo Official Account
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#121212', marginBottom: '0.4rem' }}>
            Sender ID (Simulated Social Account ID):
          </label>
          <input type="text" className="chatbox-input" style={{ width: '100%' }} value={senderId} onChange={(e) => setSenderId(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#121212', marginBottom: '0.4rem' }}>
            Message Payload:
          </label>
          <input type="text" className="chatbox-input" style={{ width: '100%' }} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
      </div>

      <button type="button" onClick={handleSendWebhook} disabled={isLoading || !message.trim()} className="send-btn" style={{ width: 'auto', alignSelf: 'flex-start' }}>
        <Send size={16} />
        {isLoading ? 'Processing Adapter...' : `Send POST /webhooks/${activeChannel}`}
      </button>

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
