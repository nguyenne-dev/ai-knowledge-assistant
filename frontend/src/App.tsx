import React, { useState, useEffect, useCallback } from 'react';
import { Database, Cpu, ShieldCheck, MessageSquareShare, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { ChatBox } from './components/ChatBox';
import { checkHealth } from './services/api';

export const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'checking' | 'offline'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await checkHealth();
      if (data && (data.status === 'ok' || data.status === 'healthy')) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus(false);
    const interval = setInterval(() => fetchStatus(false), 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="app-container">
      <Header apiStatus={apiStatus} />

      <section className="glass-card hero-card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
          <span className="hero-tag" style={{ margin: 0 }}>⚡ TECH-FASHION AI ASSISTANT</span>
          <span className="brand-badge-tag">⚡ 100% RAG ACCURACY</span>
          <span className="brand-badge-tag" style={{ background: 'var(--max-lime)' }}>⚡ ZERO HALLUCINATION</span>
          <span className="brand-badge-tag" style={{ background: 'var(--max-cyan)' }}>⚡ QDRANT RETRIEVAL</span>
        </div>

        <h2 className="hero-title" style={{ fontSize: '2rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.25 }}>
          RAG-POWERED <span className="hero-title-highlight" style={{ marginLeft: '4px', marginRight: '6px' }}>CUSTOMER INTELLIGENCE</span>
        </h2>

        <p className="hero-desc" style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: 'var(--text-secondary)', maxWidth: '900px' }}>
          Trợ lý AI tư vấn sản phẩm, chính sách bảo hành & hỗ trợ size chuẩn xác kết hợp vector search Qdrant và Google Gemini.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1.5px dashed rgba(18, 18, 18, 0.15)' }}>
          <button type="button" onClick={() => fetchStatus(true)} disabled={isRefreshing} className="chatbox-reset-btn">
            <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            <span>{isRefreshing ? 'Checking...' : 'Ping API'}</span>
          </button>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Endpoint: <code style={{ color: '#121212', background: 'var(--max-yellow)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1.2px solid #121212' }}>GET /api/health</code>
          </span>
        </div>
      </section>

      <ChatBox />

      <section className="features-grid">
        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-yellow)' }}>
            <Database size={20} />
          </div>
          <h3 className="feature-title">RAG & Vector Search</h3>
          <p className="feature-desc">
            Qdrant Vector DB with cosine similarity search. Embeds Markdown product specs, shipping policies, and FAQ.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-cyan)' }}>
            <Cpu size={20} />
          </div>
          <h3 className="feature-title">LLM Abstraction</h3>
          <p className="feature-desc">
            Decoupled provider architecture supporting modern Google Gemini (Flash / Pro series) and OpenAI models with zero vendor lock-in.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-lime)' }}>
            <ShieldCheck size={20} />
          </div>
          <h3 className="feature-title">Strict Anti-Hallucination</h3>
          <p className="feature-desc">
            Enforced grounding with prompt constraints and transparent source document citations for each answer.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-magenta)', color: '#FFFFFF' }}>
            <MessageSquareShare size={20} />
          </div>
          <h3 className="feature-title">Omni-Channel Ready</h3>
          <p className="feature-desc">
            Normalized webhook adapters for seamless expansion to Facebook Messenger and Zalo customer service.
          </p>
        </div>
      </section>

      <footer className="footer-text">
        TechFashion AI Customer Support RAG Agent • Fullstack React & Node.js Architecture
      </footer>
    </div>
  );
};

export default App;
