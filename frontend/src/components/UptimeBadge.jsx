import React from 'react';

export default function UptimeBadge({ status }) {
  const colors = { UP: { bg: '#dcfce7', text: '#16a34a' }, DOWN: { bg: '#fee2e2', text: '#dc2626' }, TIMEOUT: { bg: '#fef9c3', text: '#ca8a04' }, UNKNOWN: { bg: '#f3f4f6', text: '#6b7280' } };
  const c = colors[status] || colors.UNKNOWN;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.8rem' }}>
      {status}
    </span>
  );
}
