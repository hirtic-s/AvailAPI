import React from 'react';

export default function SSLBadge({ url }) {
  const isHttps = url?.startsWith('https');
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: isHttps ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      color: isHttps ? '#34d399' : '#fbbf24',
      padding: '0.25rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      border: `1px solid ${isHttps ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`,
    }}>
      <span style={{ fontSize: '0.65rem' }}>{isHttps ? '🔒' : '⚠️'}</span>
      {isHttps ? 'HTTPS' : 'HTTP'}
    </span>
  );
}
