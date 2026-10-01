import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'checking' | 'offline';
  serviceName?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, serviceName = 'Backend API' }) => {
  const labelMap = {
    online: `${serviceName}: Online`,
    checking: `${serviceName}: Checking...`,
    offline: `${serviceName}: Offline (Disconnected)`,
  };

  return (
    <div className={`status-pill ${status}`}>
      <span className={`status-dot ${status}`}></span>
      <span>{labelMap[status]}</span>
    </div>
  );
};
