import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  apiStatus: 'online' | 'checking' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  return (
    <header className="glass-card header-wrapper">
      <div className="brand-section">
        <div className="brand-logo-badge">
          <Zap size={26} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="brand-title">Tech-Fashion AI</h1>
            <span className="brand-badge-tag">RAG AGENT</span>
          </div>
          <div className="brand-subtitle">
            <Sparkles size={13} style={{ display: 'inline', marginRight: '4px', color: 'var(--max-purple)' }} />
            Omni-Channel Customer Support Intelligence
          </div>
        </div>
      </div>
      <StatusBadge status={apiStatus} />
    </header>
  );
};
