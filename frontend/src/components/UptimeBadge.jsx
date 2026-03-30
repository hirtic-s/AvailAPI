import React from 'react';

export default function UptimeBadge({ status }) {
  const cfg = {
    UP:      { color: '#56d364', bg: 'rgba(46,160,67,0.15)', border: 'rgba(46,160,67,0.3)' },
    DOWN:    { color: '#f85149', bg: 'rgba(248,81,73,0.15)', border: 'rgba(248,81,73,0.3)' },
    TIMEOUT: { color: '#e3b341', bg: 'rgba(227,179,65,0.15)', border: 'rgba(227,179,65,0.3)' },
    UNKNOWN: { color: '#6e7681', bg: 'rgba(110,118,129,0.1)', border: 'rgba(110,118,129,0.25)' },
  };
  const c = cfg[status] || cfg.UNKNOWN;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '1px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      letterSpacing: '0.02em', color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: c.color,
        display: 'inline-block',
        animation: status === 'UP' ? 'glow-pulse 2s ease-in-out infinite' : 'none',
      }} />
      {status || 'UNKNOWN'}
    </span>
  );
}
