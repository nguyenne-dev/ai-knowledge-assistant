import React from 'react';
import { 
  Database, 
  Share2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';

export const SystemOverview: React.FC = () => {
  return (
    <div className="glass-card milestones-card" style={{ marginBottom: '2rem' }}>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div className="avatar-badge" style={{ background: 'var(--max-lime)', width: 34, height: 34 }}>
                <Layers size={18} color="#121212" />
              </div>
              <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
                Hệ Thống & Năng Lực Vận Hành Thực Tế
              </h2>
              <span className="brand-badge-tag" style={{ background: 'var(--max-yellow)', color: '#121212' }}>
                PRODUCTION ARCHITECTURE
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              Tổng hợp chi tiết các thành phần kiến trúc, mô hình dữ liệu và công nghệ đang chạy trực tiếp trên hệ thống
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#121212', color: 'var(--max-lime)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-pill)' }}>
            STATUS: READY TO DEPLOY
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Module 1 */}
        <div className="milestone-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="avatar-badge" style={{ background: 'var(--max-yellow)', width: 30, height: 30 }}>
                <Database size={15} color="#121212" />
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#121212' }}>RAG & Vector Knowledge</strong>
            </div>
            <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Vector DB: <strong>Qdrant</strong> (Cosine distance, 768 dimensions)<br />
            • Embeddings: <strong>Google Gemini text-embedding-004</strong><br />
            • Dataset: Domain knowledge TechFashion (sản phẩm, bảng size, chính sách giao hàng & đổi trả)
          </p>
        </div>

        {/* Module 2 */}
        <div className="milestone-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="avatar-badge" style={{ background: 'var(--max-cyan)', width: 30, height: 30 }}>
                <Share2 size={15} color="#121212" />
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#121212' }}>Multi-Channel Adapters</strong>
            </div>
            <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Facebook Webhook: Tự động phân giải payload Messenger<br />
            • Zalo OA Webhook: Đồng bộ tin nhắn khách hàng đa kênh<br />
            • Chuẩn hóa dữ liệu 2 chiều (Internal Service ⇄ Channel Format)
          </p>
        </div>

        {/* Module 3 */}
        <div className="milestone-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="avatar-badge" style={{ background: 'var(--max-lime)', width: 30, height: 30 }}>
                <ShieldCheck size={15} color="#121212" />
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#121212' }}>Anti-Hallucination & Memory</strong>
            </div>
            <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Multi-turn Memory: Nhớ ngữ cảnh hội thoại theo từng Session<br />
            • Strict Grounding: Chỉ trả lời dựa trên tài liệu thực tế của thương hiệu<br />
            • Citation Cards: Trích dẫn chính xác mục & tài liệu tham chiếu
          </p>
        </div>

        {/* Module 4 */}
        <div className="milestone-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="avatar-badge" style={{ background: 'var(--max-magenta)', width: 30, height: 30, color: '#FFFFFF' }}>
                <Cpu size={15} />
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#121212' }}>DevOps & Security</strong>
            </div>
            <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Rate Limiting: Sliding-window middleware ngăn chặn spam/DDoS API<br />
            • Docker Compose: 3 services độc lập (Frontend, Backend, Qdrant)<br />
            • Sẵn sàng triển khai 1 lệnh trên mọi hạ tầng VPS Linux
          </p>
        </div>
      </div>
    </div>
  );
};
