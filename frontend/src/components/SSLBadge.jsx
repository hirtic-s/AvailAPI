import React from 'react';

export default function SSLBadge({ url }) {
  const isHttps = url?.startsWith('https');
  return (
    <span style={{ background: isHttps ? '#dcfce7' : '#fef9c3', color: isHttps ? '#16a34a' : '#ca8a04', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
      {isHttps ? '🔒 HTTPS' : '⚠️ HTTP'}
    </span>
  );
}
