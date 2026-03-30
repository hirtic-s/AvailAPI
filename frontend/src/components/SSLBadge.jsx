import React from 'react';

export default function SSLBadge({ url }) {
  const isHttps = url?.startsWith('https');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      background: isHttps ? 'rgba(46,160,67,0.1)' : 'rgba(227,179,65,0.1)',
      color: isHttps ? '#56d364' : '#e3b341',
      padding: '1px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      border: `1px solid ${isHttps ? 'rgba(46,160,67,0.25)' : 'rgba(227,179,65,0.25)'}`,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      {isHttps ? '🔒' : '⚠️'} {isHttps ? 'HTTPS' : 'HTTP'}
    </span>
  );
}
