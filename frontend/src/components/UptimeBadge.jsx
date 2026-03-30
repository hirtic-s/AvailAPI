import React from 'react';

export default function UptimeBadge({ status }) {
  const cfg = {
    UP:      { color: 'var(--status-up)', bg: 'var(--bg-up-subtle)', border: 'var(--border-up-subtle)' },
    DOWN:    { color: 'var(--status-down)', bg: 'var(--bg-down-subtle)', border: 'var(--border-down-subtle)' },
    TIMEOUT: { color: 'var(--status-timeout)', bg: 'var(--bg-timeout-subtle)', border: 'var(--border-timeout-subtle)' },
    UNKNOWN: { color: 'var(--text-muted)', bg: 'var(--bg-unknown-subtle)', border: 'var(--border-unknown-subtle)' },
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
