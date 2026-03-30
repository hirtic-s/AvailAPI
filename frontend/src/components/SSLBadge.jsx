import React from 'react';

export default function SSLBadge({ url }) {
  const isHttps = url?.startsWith('https');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      background: isHttps ? 'var(--bg-up-subtle)' : 'var(--bg-timeout-subtle)',
      color: isHttps ? 'var(--status-up)' : 'var(--status-timeout)',
      padding: '1px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      border: `1px solid ${isHttps ? 'var(--border-up-subtle)' : 'var(--border-timeout-subtle)'}`,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      {isHttps ? '🔒' : '⚠️'} {isHttps ? 'HTTPS' : 'HTTP'}
    </span>
  );
}
