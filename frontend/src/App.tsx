import React, { useState, useEffect, useCallback } from 'react';
import { 
  Database, 
  Cpu, 
  ShieldCheck, 
  MessageSquareShare, 
  RefreshCw, 
  Terminal, 
  Code2
} from 'lucide-react';
import { Header } from './components/Header';
import { ChatBox } from './components/ChatBox';
import { WebhookSimulator } from './components/WebhookSimulator';
import { SystemOverview } from './components/SystemOverview';
import { checkHealth } from './services/api';

export const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'checking' | 'offline'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);

  const fetchStatus = useCallback(async (isManual: boolean = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      const data = await checkHealth();
      if (data && (data.status === 'ok' || data.status === 'healthy' || data.qdrant)) {
        setApiStatus('online');
        setHealthData(data);
      } else {
        setApiStatus('offline');
        setHealthData(null);
      }
    } catch {
      setApiStatus('offline');
      setHealthData(null);
    } finally {
      if (isManual) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchStatus(false);
    // Poll health status in background every 30 seconds silently
    const interval = setInterval(() => fetchStatus(false), 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleManualPing = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRefreshing) {
      fetchStatus(true);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header apiStatus={apiStatus} />

      {/* Hero Section - Compact, High Impact, Space-Efficient */}
      <section className="glass-card hero-card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        {/* 1. Top Category & Tech Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
          <span className="hero-tag" style={{ margin: 0 }}>NYSAKI TECH-FASHION CSKH</span>
          <span className="brand-badge-tag">100% RAG GROUNDING</span>
          <span className="brand-badge-tag" style={{ background: 'var(--max-lime)' }}>ZERO HALLUCINATION</span>
          <span className="brand-badge-tag" style={{ background: 'var(--max-cyan)' }}>QDRANT VECTOR DB</span>
          <span className="brand-badge-tag" style={{ background: 'var(--max-purple)', color: '#FFFFFF' }}>FB & ZALO ADAPTERS</span>
        </div>

        {/* 2. Main Title - 100% Full Width, Unclipped & Bold */}
        <h2 className="hero-title" style={{ fontSize: '2rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.25 }}>
          RAG-POWERED <span className="hero-title-highlight" style={{ marginLeft: '4px', marginRight: '6px' }}>CUSTOMER INTELLIGENCE</span>
        </h2>

        {/* 3. Description Text */}
        <p className="hero-desc" style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: 'var(--text-secondary)', maxWidth: '900px' }}>
          Hệ thống Trợ lý AI tư vấn sản phẩm thời trang, đề xuất size chuẩn xác theo số đo và giải đáp chính sách bảo hành - đổi trả. Tích hợp Qdrant Vector Search, Google Gemini và Webhook chuẩn hóa cho Facebook Messenger & Zalo OA.
        </p>

        {/* 4. Action & Diagnostics Bar - Strict Single-Line Horizontal Layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'nowrap', whiteSpace: 'nowrap', paddingTop: '0.5rem', borderTop: '1.5px dashed rgba(18, 18, 18, 0.15)' }}>
          <button
            type="button"
            onClick={handleManualPing}
            disabled={isRefreshing}
            className="chatbox-reset-btn"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.45rem 0.85rem',
              width: '138px',
              minWidth: '138px',
              maxWidth: '138px',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              cursor: isRefreshing ? 'default' : 'pointer',
              gap: '0.5rem'
            }}
            title="Kiểm tra kết nối Backend API"
          >
            <RefreshCw 
              size={15} 
              strokeWidth={2.5} 
              className={isRefreshing ? 'spin-anim' : ''} 
              style={{ flexShrink: 0 }} 
            />
            <span key={isRefreshing ? 'checking' : 'ping'} className="btn-text-fade" style={{ flexShrink: 0 }}>
              {isRefreshing ? 'Checking...' : 'Ping API'}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowDiagnostics((prev) => !prev);
            }}
            className="chatbox-reset-btn"
            style={{
              fontSize: '0.8rem',
              padding: '0.45rem 0.9rem',
              width: '150px',
              minWidth: '150px',
              maxWidth: '150px',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              background: showDiagnostics ? 'var(--max-yellow)' : '#FFFFFF',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Code2 size={15} strokeWidth={2.3} style={{ flexShrink: 0 }} />
            <span key={showDiagnostics ? 'closed' : 'opened'} className="btn-text-fade" style={{ flexShrink: 0 }}>
              {showDiagnostics ? 'Đóng Payload' : 'Mở Payload'}
            </span>
          </button>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Endpoint: <code style={{ color: '#121212', background: 'var(--max-yellow)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1.2px solid #121212', whiteSpace: 'nowrap' }}>GET /api/health</code>
          </span>
        </div>

        {/* 5. Collapsible Diagnostics JSON Box with Smooth Accordion */}
        <div className={`diagnostic-wrapper ${showDiagnostics && healthData ? 'open' : ''}`}>
          <div className="diagnostic-inner">
            <div className="diagnostic-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--max-yellow)', fontWeight: 700 }}>
                <Terminal size={14} />
                <span>Live Response Payload from Express Backend:</span>
              </div>
              <pre>{healthData ? JSON.stringify(healthData, null, 2) : '// No payload data'}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Chat Interface */}
      <ChatBox />

      {/* Core Architectural Pillars */}
      <section className="features-grid">
        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-yellow)' }}>
            <Database size={20} />
          </div>
          <h3 className="feature-title">RAG & Vector Knowledge</h3>
          <p className="feature-desc">
            Cơ sở dữ liệu Qdrant Vector DB với cosine similarity search. Embeddings danh mục sản phẩm thời trang, bảng size và quy chế đổi trả.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-cyan)' }}>
            <Cpu size={20} />
          </div>
          <h3 className="feature-title">LLM Abstraction Layer</h3>
          <p className="feature-desc">
            Kiến trúc decoupled hỗ trợ linh hoạt Google Gemini (Flash / Pro) & OpenAI, tối ưu hóa chi phí token và tốc độ phản hồi tư vấn.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-lime)' }}>
            <ShieldCheck size={20} />
          </div>
          <h3 className="feature-title">Strict Anti-Hallucination</h3>
          <p className="feature-desc">
            Quy tắc kiểm soát chặt chẽ (Grounding constraints), chỉ tư vấn dựa trên thông số thực tế và trích dẫn minh bạch nguồn tài liệu.
          </p>
        </div>

        <div className="glass-card feature-box">
          <div className="feature-icon-wrapper" style={{ background: 'var(--max-magenta)', color: '#FFFFFF' }}>
            <MessageSquareShare size={20} />
          </div>
          <h3 className="feature-title">Omni-Channel Adapters</h3>
          <p className="feature-desc">
            Bộ chuyển đổi Webhook chuẩn hóa đa kênh, sẵn sàng đồng bộ tin nhắn tư vấn và đơn hàng từ Facebook Messenger và Zalo OA.
          </p>
        </div>
      </section>

      {/* Multi-Channel Webhook Simulator */}
      <WebhookSimulator />

      {/* System Overview & Production Capabilities */}
      <SystemOverview />

      {/* Footer */}
      <footer className="footer-text">
        TechFashion AI Customer Support • Specially Engineered for Fashion E-Commerce • Fullstack React & Node.js
      </footer>
    </div>
  );
};

export default App;
