import React from 'react';
import { Shirt, Headphones } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  apiStatus: 'online' | 'checking' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  return (
    <header className="glass-card header-wrapper">
      <div className="brand-section">
        <div className="brand-logo-badge" title="TechFashion Brand">
          <Shirt size={24} strokeWidth={2.4} color="#121212" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="brand-title">TechFashion AI</h1>
            <span className="brand-badge-tag" style={{ background: 'var(--max-yellow)', color: '#121212' }}>
              FASHION CSKH
            </span>
          </div>
          <div className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Headphones size={14} style={{ flexShrink: 0, color: '#121212' }} />
            <span>Hệ thống Tư vấn & CSKH Thời trang Đa kênh (Facebook & Zalo)</span>
          </div>
        </div>
      </div>
      <StatusBadge status={apiStatus} />
    </header>
  );
};
